import { Schema } from 'mongoose';
import { PaymentMethod, PaymentStatus } from '../libs/enums/payment.enum';

const PaymentSchema = new Schema(
  {
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true,
    },
    
    patient: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
      index: true,
    },
    
    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'Doctor',
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
      default: PaymentMethod.CARD,
    },
    
    status: {
      type: String,
      enum: PaymentStatus,
      default: PaymentStatus.PENDING,
      index: true,
    },
    
    refundRequestReason: {
      type: String,
    },
    
    refundRequestedAt: {
      type: Date,
    },
    
    refundedBy: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
    },
    
    refundReason: {
      type: String,
    },
    
    refundedAt: {
      type: Date,
    },
    
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    collection: 'payments',
  }
);

PaymentSchema.index({ appointment: 1 });
PaymentSchema.index({ patient: 1, createdAt: -1 });
PaymentSchema.index({ doctor: 1, createdAt: -1 });
PaymentSchema.index({ status: 1 });

export default PaymentSchema;