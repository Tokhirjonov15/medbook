import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import type { ObjectId } from 'mongoose';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { AiChatInput } from '../../libs/dto/ai-chat/ai-chat.input';
import { AiChatResponse } from '../../libs/dto/ai-chat/ai-chat';
import { AiChatService } from './ai-chat.service';

@Resolver()
export class AiChatResolver {
	constructor(private readonly aiChatService: AiChatService) {}

	@Roles(MemberType.PATIENT)
	@UseGuards(RolesGuard)
	@Mutation(() => AiChatResponse)
	public async askAiChat(
		@Args('input') input: AiChatInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<AiChatResponse> {
		console.log('Mutation: askAiChat');
		return await this.aiChatService.askAiChat(memberId, input);
	}
}
