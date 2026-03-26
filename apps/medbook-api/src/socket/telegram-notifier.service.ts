import { Injectable, Logger } from '@nestjs/common';
import { MessagePayload } from './socket.types';

@Injectable()
export class TelegramNotifierService {
	private readonly logger = new Logger(TelegramNotifierService.name);
	private readonly telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
	private readonly telegramAdminChatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
	private readonly telegramThreadId = process.env.TELEGRAM_ADMIN_THREAD_ID;

	public async notifyNewPublicMessage(message: MessagePayload): Promise<void> {
		if (!this.telegramBotToken || !this.telegramAdminChatId) {
			this.logger.warn('Telegram integration skipped: TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID is missing');
			return;
		}

		const body: Record<string, string | number> = {
			chat_id: this.telegramAdminChatId,
			text: this.formatMessage(message),
		};

		if (this.telegramThreadId) {
			body.message_thread_id = Number(this.telegramThreadId);
		}

		try {
			const response = await fetch(`https://api.telegram.org/bot${this.telegramBotToken}/sendMessage`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
			});

			if (!response.ok) {
				const errorText = await response.text();
				this.logger.error(`Telegram send failed: ${response.status} ${errorText}`);
			}
		} catch (error: any) {
			this.logger.error(`Telegram send failed: ${error?.message ?? 'Unknown error'}`);
		}
	}

	private formatMessage(message: MessagePayload): string {
		const senderNick = message.memberData?.memberNick ?? 'Unknown user';
		const senderType = message.memberData?.memberType ?? 'UNKNOWN';
		const createdAt = message.createdAt ? new Date(message.createdAt).toISOString() : new Date().toISOString();

		return [
			'Medbook public chat',
			`User: ${senderNick}`,
			`Role: ${senderType}`,
			`Time: ${createdAt}`,
			`Message: ${message.text}`,
		].join('\n');
	}
}
