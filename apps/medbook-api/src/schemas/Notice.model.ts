import { Schema } from 'mongoose';
import { NoticeStatus, NoticeTarget } from '../libs/enums/notice.enum';

const NoticeSchema = new Schema(
	{
		title: {
			type: String,
			trim: true,
			required: true,
		},

		content: {
			type: String,
			required: true,
		},

		status: {
			type: String,
			enum: NoticeStatus,
			default: NoticeStatus.ACTIVE,
		},

		target: {
			type: String,
			enum: NoticeTarget,
			default: NoticeTarget.ALL,
		},

		authorId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},
	},
	{
		timestamps: true,
		collection: 'notices',
	},
);

export default NoticeSchema;
