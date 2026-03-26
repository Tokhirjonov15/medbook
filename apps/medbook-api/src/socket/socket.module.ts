import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SocketGateway } from './socket.gateway';
import { AuthModule } from '../components/auth/auth.module';
import PublicChatMessageSchema from '../schemas/PublicChatMessage.model';
import { PublicChatService } from './public-chat.service';
import { TelegramNotifierService } from './telegram-notifier.service';

@Module({
	imports: [
		AuthModule,
		MongooseModule.forFeature([{ name: 'PublicChatMessage', schema: PublicChatMessageSchema }]),
	],
	providers: [SocketGateway, PublicChatService, TelegramNotifierService],
})
export class SocketModule {}
