import { Logger } from '@nestjs/common';
import { OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'ws';
import * as WebSocket from 'ws';
import { AuthService } from '../components/auth/auth.service';
import * as url from 'url';
import { Member } from '../libs/dto/members/member';
import { Message } from '../libs/enums/common.enum';
import { PublicChatService } from './public-chat.service';
import { InfoPayload, MessagePayload } from './socket.types';

@WebSocketGateway({ transports: ['websocket'], secure: false })
export class SocketGateway implements OnGatewayInit {
	private logger: Logger = new Logger('SocketEventsGateway');
	private summaryClient: number = 0;
	private clientsAuthMap = new Map<WebSocket, Member | null>();

	constructor(
		private authService: AuthService,
		private publicChatService: PublicChatService,
	) {}

	@WebSocketServer()
	server!: Server;

	public afterInit(server: Server) {
		this.logger.verbose(`WebSocket Server Initialized & total [${this.summaryClient}]`);
	}

	private async retrieveAuth(req: any): Promise<Member | null> {
		try {
			const parseUrl = url.parse(req.url, true);
			const { token } = parseUrl.query;
			return await this.authService.verifyToken(token as string);
		} catch (err) {
			return null;
		}
	}

	public async handleConnection(client: WebSocket, req: any) {
		const authMember = await this.retrieveAuth(req);
		this.summaryClient++;
		this.clientsAuthMap.set(client, authMember);

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`Connection [${clientNick}] & total [${this.summaryClient}]`);

		const infoMsg: InfoPayload = {
			event: 'info',
			totalClient: this.summaryClient,
			memberData: authMember ? { ...authMember, _id: authMember._id.toString() } : null,
			action: 'joined',
		};
		this.emitMessage(infoMsg);
		const messageList = await this.publicChatService.getRecentMessages();
		client.send(JSON.stringify({ event: 'getMessages', list: messageList }));
	}

	public handleDisconnect(client: WebSocket) {
		if (!this.clientsAuthMap.has(client)) return;

		const authMember = this.clientsAuthMap.get(client);
		this.summaryClient = Math.max(0, this.summaryClient - 1);
		this.clientsAuthMap.delete(client);

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`Disconnection [${clientNick}] & total [${this.summaryClient}]`);

		const infoMsg: InfoPayload = {
			event: 'info',
			totalClient: this.summaryClient,
			memberData: authMember ? { ...authMember, _id: authMember._id.toString() } : null,
			action: 'left',
		};
		this.broadcastMessage(client, infoMsg);
	}

	@SubscribeMessage('message')
	public async handleMessage(client: WebSocket, payload: string | { text?: string }): Promise<void> {
		const authMember = this.clientsAuthMap.get(client);
		if (!authMember) {
			client.send(JSON.stringify({ event: 'error', message: Message.NOT_AUTHENTICATED }));
			return;
		}

		const text = this.extractMessageText(payload);
		if (!text) {
			client.send(JSON.stringify({ event: 'error', message: Message.BAD_REQUEST }));
			return;
		}

		const clientNick: string = authMember?.memberNick ?? 'Guest';
		this.logger.verbose(`NEW MESSAGE [${clientNick}]: ${text}`);

		const newMessage = await this.publicChatService.createMessage(authMember, text);
		this.emitMessage(newMessage);
	}

	private extractMessageText(payload: string | { text?: string }): string {
		if (typeof payload === 'string') return payload.trim();
		return payload?.text?.trim?.() ?? '';
	}

	private broadcastMessage(sender: WebSocket, message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client !== sender && client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}

	private emitMessage(message: InfoPayload | MessagePayload) {
		this.server.clients.forEach((client) => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(JSON.stringify(message));
			}
		});
	}
}

/*
MESSAGE TARGET
 1. Client (only client)
 2. Broadcast (except client)
 3. Emit (all clients)
 */
