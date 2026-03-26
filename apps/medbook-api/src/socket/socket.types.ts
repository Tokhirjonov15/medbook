import { MemberType } from '../libs/enums/member.enum';

export interface ChatSender {
	_id: string;
	memberNick: string;
	memberType: MemberType | string;
	memberImage?: string;
}

export interface MessagePayload {
	event: 'message';
	_id?: string;
	text: string;
	memberData: ChatSender | null;
	createdAt?: Date;
}

export interface InfoPayload {
	event: 'info' | 'error';
	totalClient?: number;
	memberData?: ChatSender | null;
	action?: string;
	message?: string;
}
