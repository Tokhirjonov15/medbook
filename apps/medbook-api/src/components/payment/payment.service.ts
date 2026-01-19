import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, Payments } from '../../libs/dto/payment/payment';
import { Model, ObjectId } from 'mongoose';
import { Appointment } from '../../libs/dto/appoinment/appoinment';
import {
	CreatePaymentInput,
	PaymentsInquiry,
	RefundByAdminInput,
	RequestRefundInput,
} from '../../libs/dto/payment/payment.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { PaymentStatus } from '../../libs/enums/payment.enum';
import { T } from '../../libs/types/common';
import {
	lookupAppointment,
	lookupDoctor,
	lookupPatient,
	lookupRefunded,
	shapeIntoMongoObjectId,
} from '../../libs/config';

@Injectable()
export class PaymentService {
	constructor(
		@InjectModel('Payment') private readonly paymentModel: Model<Payment>,
		@InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>,
	) {}

	public async createPayment(input: CreatePaymentInput, patientId: ObjectId): Promise<Payment> {
		const appointment = await this.appointmentModel.findById(input.appointmentId).exec();

		if (!appointment) {
			throw new NotFoundException(Message.NO_DATA_FOUND);
		}

		if (appointment.patient.toString() !== patientId.toString()) {
			throw new BadRequestException(Message.ONLY_SPECIFIC_ROLES_ALLOWED);
		}

		const existing = await this.paymentModel.findOne({ appointment: input.appointmentId }).exec();

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

		await this.appointmentModel.findByIdAndUpdate(input.appointmentId, { paymentStatus: PaymentStatus.PAID }).exec();

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
				{ new: true },
			)
			.exec();
		if (!updated) throw new BadRequestException(Message.UPDATE_FAILED);

		return updated;
	}

	public async refundByAdmin(input: RefundByAdminInput, adminId: ObjectId): Promise<Payment> {
		const payment = await this.paymentModel.findById(input.paymentId).exec();
		if (!payment) {
			throw new NotFoundException(Message.NO_DATA_FOUND);
		}

		if (payment.status !== PaymentStatus.REFUND_REQUESTED) {
			throw new BadRequestException(Message.NO_DATA_FOUND);
		}

		const refunded = await this.paymentModel
			.findByIdAndUpdate(
				input.paymentId,
				{
					status: PaymentStatus.REFUNDED,
					refundedBy: adminId,
					refundReason: input.adminNote,
					refundedAt: new Date(),
				},
				{ new: true },
			)
			.exec();

		await this.appointmentModel
			.findByIdAndUpdate(payment.appointment, { paymentStatus: PaymentStatus.REFUNDED })
			.exec();

		if (!refunded) throw new BadRequestException(Message.UPDATE_FAILED);
		return refunded;
	}

	public async getAllPaymentsByAdmin(input: PaymentsInquiry): Promise<Payments> {
		const { page, limit, sort, direction, filter } = input;
		const match: T = {};
		const sortQuery: T = { [sort ?? 'createdAt']: direction ?? Direction.DESC };

		// Apply filters
		if (filter?.status) {
			match.status = filter.status;
		}
		if (filter?.patientId) {
			match.patient = shapeIntoMongoObjectId(filter.patientId);
		}
		if (filter?.doctorId) {
			match.doctor = shapeIntoMongoObjectId(filter.doctorId);
		}

		if (filter?.startDate || filter?.endDate) {
			match.createdAt = {};
			if (filter.startDate) {
				match.createdAt.$gte = new Date(filter.startDate);
			}
			if (filter.endDate) {
				match.createdAt.$lte = new Date(filter.endDate);
			}
		}

		const result = await this.paymentModel
			.aggregate([
				{ $match: match },
				{ $sort: sortQuery },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							lookupAppointment,
							{
								$unwind: {
									path: '$appointmentData',
									preserveNullAndEmptyArrays: true,
								},
							},
							lookupPatient,
							{
								$unwind: {
									path: '$patientData',
									preserveNullAndEmptyArrays: true,
								},
							},
							lookupDoctor,
							{
								$unwind: {
									path: '$doctorData',
									preserveNullAndEmptyArrays: true,
								},
							},
							lookupRefunded,
							{
								$unwind: {
									path: '$refundedByData',
									preserveNullAndEmptyArrays: true,
								},
							},
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) {
			throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		}

		return result[0];
	}
}
