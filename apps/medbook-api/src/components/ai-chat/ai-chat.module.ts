import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from '../auth/auth.module';
import { AiChatResolver } from './ai-chat.resolver';
import { AiChatService } from './ai-chat.service';

@Module({
	imports: [AuthModule, HttpModule],
	providers: [AiChatResolver, AiChatService],
	exports: [AiChatService],
})
export class AiChatModule {}
