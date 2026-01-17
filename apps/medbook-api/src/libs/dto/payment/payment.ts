import { Field, ObjectType, ID, Float } from '@nestjs/graphql';
import { PaymentStatus, PaymentMethod } from '../../enums/payment.enum';
import { MetaCounter } from '../doctors/doctor';

@ObjectType()
export class Payment {
  @Field(() => ID)
  _id: string;

  @Field(() => ID)
  appointment: string;

  @Field(() => ID)
  patient: string;

  @Field(() => ID)
  doctor: string;

  @Field(() => Float)
  amount: number;

  @Field(() => Float)
  platformFee: number;

  @Field(() => Float)
  doctorAmount: number;

  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Field(() => PaymentStatus)
  status: PaymentStatus;

  @Field(() => String, { nullable: true })
  refundRequestReason?: string;

  @Field(() => Date, { nullable: true })
  refundRequestedAt?: Date;

  @Field(() => ID, { nullable: true })
  refundedBy?: string;

  @Field(() => String, { nullable: true })
  refundReason?: string;

  @Field(() => Date, { nullable: true })
  refundedAt?: Date;

  @Field(() => Date, { nullable: true })
  paidAt?: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class Payments {
  @Field(() => [Payment])
  list: Payment[];

  @Field(() => [MetaCounter])
  metaCounter: MetaCounter[];
}