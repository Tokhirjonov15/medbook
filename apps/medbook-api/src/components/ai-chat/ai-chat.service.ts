import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import type { ObjectId } from 'mongoose';
import { Message } from '../../libs/enums/common.enum';
import { AiChatInput } from '../../libs/dto/ai-chat/ai-chat.input';
import { AiChatResponse } from '../../libs/dto/ai-chat/ai-chat';

@Injectable()
export class AiChatService {
	constructor(private readonly httpService: HttpService) {}

	public async askAiChat(memberId: ObjectId, input: AiChatInput): Promise<AiChatResponse> {
		const apiKey = process.env.OPENAI_API_KEY;
		const model = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

		if (!apiKey) {
			throw new InternalServerErrorException('OPENAI_API_KEY is not configured');
		}

		const systemPrompt = [
			'You are MedBook assistant for patients only.',
			'Provide general, safe health guidance only.',
			'Do not provide diagnosis or definitive treatment plans.',
			'If symptoms are severe or urgent, advise emergency care immediately.',
			'Keep responses concise and practical.',
		].join(' ');

		try {
			const payload = {
				model,
				messages: [
					{ role: 'system', content: systemPrompt },
					{ role: 'user', content: input.message },
				],
				temperature: 0.4,
				max_tokens: 400,
			};

			const response = await firstValueFrom(
				this.httpService.post('https://api.openai.com/v1/chat/completions', payload, {
					headers: {
						Authorization: `Bearer ${apiKey}`,
						'Content-Type': 'application/json',
					},
					timeout: 30000,
				}),
			);

			const reply =
				response?.data?.choices?.[0]?.message?.content?.trim() ||
				'I am unable to respond right now. Please try again.';

			return { reply };
		} catch (err: any) {
			const msg = err?.response?.data?.error?.message ?? err?.message ?? Message.SOMETHING_WENT_WRONG;
			console.log('Error, service. askAiChat:', msg, memberId?.toString?.());
			throw new BadRequestException(msg);
		}
	}
}
