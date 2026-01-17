import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from '../../libs/dto/payment/payment';
import { Model, ObjectId } from 'mongoose';
import { Appointment } from '../../libs/dto/appoinment/appoinment';
import { CreatePaymentInput, RefundByAdminInput, RequestRefundInput } from '../../libs/dto/payment/payment.input';
import { Message } from '../../libs/enums/common.enum';
import { PaymentStatus } from '../../libs/enums/payment.enum';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel('Payment') private readonly paymentModel: Model<Payment>,
        @InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>,
    ) {}

    public async createPayment(input: CreatePaymentInput, patientId: ObjectId): Promise<Payment> {
        const appointment = await this.appointmentModel
            .findById(input.appointmentId)
            .exec();

        if (!appointment) {
            throw new NotFoundException(Message.NO_DATA_FOUND);
        }

        if (appointment.patient.toString() !== patientId.toString()) {
            throw new BadRequestException(Message.ONLY_SPECIFIC_ROLES_ALLOWED);
        }

        const existing = await this.paymentModel
            .findOne({ appointment: input.appointmentId })
            .exec();

        if (existing) {
            throw new BadRequestException('Payment already exists for this appointment');
        }

        const amount = appointment.consultationFee;
        const platformFeePercentage = 0.15;
        const platformFee = Math.round(amount * platformFeePercentage);
        const doctorAmount = amount - platformFee;

        const paymentPayload = {
            appointment: input.appointmentId,
            patient: patientId,
            doctor: appointment.doctor,
            amount,
            platformFee,
            doctorAmount,
            paymentMethod: input.paymentMethod,
            status: PaymentStatus.PAID,
            paidAt: new Date(),
        };

        const payment = await this.paymentModel.create(paymentPayload);

        await this.appointmentModel.findByIdAndUpdate(
            input.appointmentId,
            { paymentStatus: PaymentStatus.PAID }
            ).exec();

        return payment;
    }

    public async requestForRefund(input: RequestRefundInput, patientId: ObjectId): Promise<Payment> {
        const payment = await this.paymentModel.findById(input.paymentId).exec();
        if (!payment) {
            throw new NotFoundException(Message.NO_DATA_FOUND);
        }

        if (payment.patient.toString() !== patientId.toString()) {
            throw new BadRequestException(Message.ONLY_SPECIFIC_ROLES_ALLOWED);
        }

        if (payment.status !== PaymentStatus.PAID) {
            throw new BadRequestException(Message.NO_DATA_FOUND);
        }

        const updated = await this.paymentModel
            .findByIdAndUpdate(
                input.paymentId,
                {
                    status: PaymentStatus.REFUND_REQUESTED,
                    refundRequestReason: input.reason,
                    refundRequestedAt: new Date(),
                },
                { new: true }
            )
            .exec();
        if(!updated) throw new BadRequestException(Message.UPDATE_FAILED);

        return updated;
    }
}
