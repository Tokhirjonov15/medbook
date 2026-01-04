import { Schema } from 'mongoose';
import { PaymentMethod, PaymentStatus } from '../libs/enums/payment.enum';

const PaymentSchema = new Schema(
  {
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true,
      index: true,
    },

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

    amount: {
      type: Number,
      required: true,
    },

    platformFee: {
      type: Number,
      default: 0,
    },

    doctorAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: PaymentMethod,
      required: true,
    },

    status: {
      type: String,
      enum: PaymentStatus,
      default: PaymentStatus.PENDING,
      index: true,
    },

    stripePaymentIntentId: {
      type: String,
      index: true,
    },

    stripeChargeId: {
      type: String,
    },

    refundId: {
      type: String,
    },

    refundReason: {
      type: String,
    },

    paidAt: {
      type: Date,
    },

    refundedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'payments',
  }
);

// Indexes
PaymentSchema.index({ appointment: 1 });
PaymentSchema.index({ patient: 1, createdAt: -1 });
PaymentSchema.index({ doctor: 1, createdAt: -1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ stripePaymentIntentId: 1 });

export default PaymentSchema;