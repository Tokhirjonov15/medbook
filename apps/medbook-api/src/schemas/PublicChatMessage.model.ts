import { Schema } from 'mongoose';

const PublicChatMessageSchema = new Schema(
	{
		senderId: {
			type: Schema.Types.ObjectId,
			required: true,
			index: true,
		},

		senderNick: {
			type: String,
			required: true,
			trim: true,
		},

		senderType: {
			type: String,
			required: true,
		},

		senderImage: {
			type: String,
			default: '',
		},

		text: {
			type: String,
			required: true,
			trim: true,
			maxlength: 2000,
		},
	},
	{
		timestamps: true,
		collection: 'public_chat_messages',
	},
);

PublicChatMessageSchema.index({ createdAt: -1 });

export default PublicChatMessageSchema;
