import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Payment } from '../../libs/dto/payment/payment';
import { CreatePaymentInput, RefundByAdminInput, RequestRefundInput } from '../../libs/dto/payment/payment.input';
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
}
