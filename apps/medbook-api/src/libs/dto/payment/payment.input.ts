import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';
import { PaymentMethod } from '../../enums/payment.enum';
import type { ObjectId } from 'mongoose';

@InputType()
export class CreatePaymentInput {
  @IsNotEmpty()
  @Field(() => String)
  appointmentId: ObjectId;

  @IsEnum(PaymentMethod)
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;
}

@InputType()
export class RequestRefundInput {
  @IsNotEmpty()
  @Field(() => String)
  paymentId: ObjectId;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  reason: string;
}

@InputType()
export class RefundByAdminInput {
  @IsNotEmpty()
  @Field(() => String)
  paymentId: ObjectId;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  adminNote: string;
}

@InputType()
export class PaymentsInquiry {
  @Field(() => Number)
  page: number;

  @Field(() => Number)
  limit: number;
}