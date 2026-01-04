// src/reviews/schemas/review.schema.ts
import { Schema } from 'mongoose';
import { ReviewStatus } from '../libs/enums/review.enum';

const ReviewSchema = new Schema(
  {
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true,
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      index: true,
    },

    comment: {
      type: String,
      required: true,
    },

    doctorReply: {
      comment: String,
      repliedAt: Date,
    },

    helpfulCount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ReviewStatus,
      default: ReviewStatus.PENDING,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'reviews',
  }
);

// Indexes
ReviewSchema.index({ doctor: 1, createdAt: -1 });
ReviewSchema.index({ patient: 1 });
ReviewSchema.index({ appointment: 1 });
ReviewSchema.index({ status: 1 });
ReviewSchema.index({ rating: 1 });

export default ReviewSchema;