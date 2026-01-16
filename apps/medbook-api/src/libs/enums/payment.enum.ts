import { registerEnumType } from '@nestjs/graphql';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUND_REQUESTED = 'REFUND_REQUESTED',
  REFUNDED = 'REFUNDED',
}

export enum PaymentMethod {
  CARD = 'CARD',
  BANK_TRANSFER = "BANK_TRANSFER",
  CASH = 'CASH',
}

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'Payment status',
});