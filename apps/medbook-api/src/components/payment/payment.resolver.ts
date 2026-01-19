import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Payment, Payments } from '../../libs/dto/payment/payment';
import {
	CreatePaymentInput,
	PaymentsInquiry,
	RefundByAdminInput,
	RequestRefundInput,
} from '../../libs/dto/payment/payment.input';
import type { ObjectId } from 'mongoose';
import { AuthMember } from '../auth/decorators/authMember.decorator';

@Resolver()
export class PaymentResolver {
	constructor(private readonly paymentService: PaymentService) {}

	@Roles(MemberType.PATIENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Payment)
	async createPayment(
		@Args('input') input: CreatePaymentInput,
		@AuthMember('_id') patientId: ObjectId,
	): Promise<Payment> {
		console.log('Mutation: createPayment');
		return await this.paymentService.createPayment(input, patientId);
	}

	@Roles(MemberType.PATIENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Payment)
	async requestForRefund(
		@Args('input') input: RequestRefundInput,
		@AuthMember('_id') patientId: ObjectId,
	): Promise<Payment> {
		console.log('Mutation: requestForRefund');
		return await this.paymentService.requestForRefund(input, patientId);
	}

	/** ADMIN */

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Payment)
	async refundByAdmin(
		@Args('input') input: RefundByAdminInput,
		@AuthMember('_id') adminId: ObjectId,
	): Promise<Payment> {
		console.log('Mutation: refundByAdmin');
		return await this.paymentService.refundByAdmin(input, adminId);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Payments)
	async getAllPaymentsByAdmin(@Args('input') input: PaymentsInquiry): Promise<Payments> {
		console.log('Query: getAllPaymentsByAdmin');
		return await this.paymentService.getAllPaymentsByAdmin(input);
	}
}
