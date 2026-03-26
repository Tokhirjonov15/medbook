import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../libs/dto/members/member';
import { Message } from '../libs/enums/common.enum';
import { MessagePayload } from './socket.types';
import { TelegramNotifierService } from './telegram-notifier.service';

interface PublicChatMessageDocument {
	_id: string;
	senderId: string;
	senderNick: string;
	senderType: string;
	senderImage?: string;
	text: string;
	createdAt: Date;
}

@Injectable()
export class PublicChatService {
	constructor(
		@InjectModel('PublicChatMessage') private readonly publicChatMessageModel: Model<PublicChatMessageDocument>,
		private readonly telegramNotifierService: TelegramNotifierService,
	) {}

	public async getRecentMessages(limit = 30): Promise<MessagePayload[]> {
		const messages = await this.publicChatMessageModel.find().sort({ createdAt: -1 }).limit(limit).lean().exec();
		return messages.reverse().map((message) => this.shapeMessagePayload(message));
	}

	public async createMessage(member: Member, rawText: string): Promise<MessagePayload> {
		const text = rawText?.trim();
		if (!text) throw new BadRequestException(Message.BAD_REQUEST);

		try {
			const createdMessage = await this.publicChatMessageModel.create({
				senderId: member._id,
				senderNick: member.memberNick,
				senderType: member.memberType,
				senderImage: member.memberImage ?? '',
				text,
			});

			const payload = this.shapeMessagePayload({
				_id: createdMessage._id.toString(),
				senderId: createdMessage.senderId.toString(),
				senderNick: createdMessage.senderNick,
				senderType: createdMessage.senderType,
				senderImage: createdMessage.senderImage,
				text: createdMessage.text,
				createdAt: createdMessage.createdAt,
			});

			void this.telegramNotifierService.notifyNewPublicMessage(payload);
			return payload;
		} catch (error) {
			console.log('ERROR, service.createMessage:', error);
			throw new InternalServerErrorException(Message.CREATE_FAILED);
		}
	}

	private shapeMessagePayload(message: PublicChatMessageDocument): MessagePayload {
		return {
			event: 'message',
			_id: message._id?.toString(),
			text: message.text,
			memberData: {
				_id: message.senderId,
				memberNick: message.senderNick,
				memberType: message.senderType as any,
				memberImage: message.senderImage ?? '',
			},
			createdAt: message.createdAt,
		};
	}
}
