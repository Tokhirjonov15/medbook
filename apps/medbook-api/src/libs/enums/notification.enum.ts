import { registerEnumType } from '@nestjs/graphql';

export enum NotificationType {
	APPOINTMENT = 'APPOINTMENT',
	PRESCRIPTION = 'PRESCRIPTION',
	PAYMENT = 'PAYMENT',
	REVIEW = 'REVIEW',
	REMINDER = 'REMINDER',
	SYSTEM = 'SYSTEM',
	CHAT = 'CHAT',
}

registerEnumType(NotificationType, {
	name: 'NotificationType',
	description: 'Type of notification',
});
