import { Schema } from 'mongoose';
import { NotificationType } from '../libs/enums/notification.enum';

const NotificationSchema = new Schema(
	{
		user: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},

		title: {
			type: String,
			required: true,
		},

		message: {
			type: String,
			required: true,
		},

		type: {
			type: String,
			enum: NotificationType,
			required: true,
			index: true,
		},

		link: {
			type: String,
		},

		data: {
			type: Schema.Types.Mixed,
		},

		isRead: {
			type: Boolean,
			default: false,
			index: true,
		},

		readAt: {
			type: Date,
		},
	},
	{
		timestamps: true,
		collection: 'notifications',
	},
);

// Indexes
NotificationSchema.index({ user: 1, createdAt: -1 });
NotificationSchema.index({ isRead: 1 });
NotificationSchema.index({ type: 1 });

export default NotificationSchema;
