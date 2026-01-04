import { Schema } from 'mongoose';
import { MessageType } from '../libs/enums/message.enum';

const ChatMessageSchema = new Schema(
  {
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      index: true,
    },

    sender: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    receiver: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    message: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      enum: MessageType,
      default: MessageType.TEXT,
    },

    fileUrl: {
      type: String,
    },

    fileName: {
      type: String,
    },

    fileSize: {
      type: Number,
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
    collection: 'messages',
  }
);

// Indexes
ChatMessageSchema.index({ appointment: 1, createdAt: 1 });
ChatMessageSchema.index({ sender: 1 });
ChatMessageSchema.index({ receiver: 1, isRead: 1 });

export default ChatMessageSchema;