import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsEnum, IsNumber, Min, IsOptional } from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../../enums/payment.enum';
import type { ObjectId } from 'mongoose';
import { Direction } from '../../enums/common.enum';

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
export class PaymentFilter {
	@IsOptional()
	@IsEnum(PaymentStatus)
	@Field(() => PaymentStatus, { nullable: true })
	status?: PaymentStatus;

	@IsOptional()
	@Field(() => String, { nullable: true })
	patientId?: ObjectId;

	@IsOptional()
	@Field(() => String, { nullable: true })
	doctorId?: ObjectId;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	startDate?: Date;

	@IsOptional()
	@Field(() => Date, { nullable: true })
	endDate?: Date;
}

@InputType()
export class PaymentsInquiry {
	@IsNumber()
	@Min(1)
	@Field(() => Number)
	page: number;

	@IsNumber()
	@Min(1)
	@Field(() => Number)
	limit: number;

	@IsOptional()
	@Field(() => String, { nullable: true, defaultValue: 'createdAt' })
	sort?: string;

	@IsOptional()
	@IsEnum(Direction)
	@Field(() => Direction, { nullable: true, defaultValue: Direction.DESC })
	direction?: Direction;

	@IsOptional()
	@Field(() => PaymentFilter, { nullable: true })
	filter?: PaymentFilter;
}
