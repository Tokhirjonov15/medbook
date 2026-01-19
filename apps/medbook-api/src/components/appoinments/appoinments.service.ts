import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { ObjectId } from 'mongoose';
import { Appointment, Appointments } from '../../libs/dto/appoinment/appoinment';
import { Direction, Message } from '../../libs/enums/common.enum';
import {
	AllAppointmentsInquiry,
	AppointmentsInquiry,
	BookAppointmentInput,
} from '../../libs/dto/appoinment/appoinment.input';
import { AppointmentStatus } from '../../libs/enums/appoinment.enum';
import { PaymentStatus } from '../../libs/enums/payment.enum';
import { Doctor } from '../../libs/dto/doctors/doctor';
import { T } from '../../libs/types/common';
import { DoctorsService } from '../doctors/doctors.service';
import { lookupMember } from '../../libs/config';
import { AppointmentUpdate } from '../../libs/dto/appoinment/appoinment.update';

@Injectable()
export class AppoinmentsService {
	constructor(
		@InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>,
		@InjectModel('Doctor') private readonly doctorModel: Model<Doctor>,
		private doctorService: DoctorsService,
	) {}

	public async bookAppointment(memberId: ObjectId, input: BookAppointmentInput): Promise<Appointment> {
		const { doctor, appointmentDate, timeSlot, consultationType, reason, symptoms, notes } = input;
		try {
			const targetDoctor = await this.doctorModel.findById(doctor).exec();
			if (!targetDoctor) {
				throw new BadRequestException(Message.NO_DATA_FOUND);
			}

			//  Working day check
			const appointmentDay = new Date(appointmentDate).toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();

			if (!targetDoctor.workingDays?.includes(appointmentDay)) {
				throw new BadRequestException(Message.SOMETHING_WENT_WRONG);
			}

			//  Overlap check
			const appointmentDayStart = new Date(appointmentDate);
			appointmentDayStart.setHours(0, 0, 0, 0);

			const appointmentDayEnd = new Date(appointmentDate);
			appointmentDayEnd.setHours(23, 59, 59, 999);

			const overlappingAppointments = await this.appointmentModel
				.find({
					doctor,
					appointmentDate: { $gte: appointmentDayStart, $lte: appointmentDayEnd },
					status: { $in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
					$or: [
						{ 'timeSlot.start': { $lte: timeSlot.start }, 'timeSlot.end': { $gt: timeSlot.start } },
						{ 'timeSlot.start': { $lt: timeSlot.end }, 'timeSlot.end': { $gte: timeSlot.end } },
						{ 'timeSlot.start': { $gte: timeSlot.start }, 'timeSlot.end': { $lte: timeSlot.end } },
					],
				})
				.exec();

			if (overlappingAppointments.length > 0) {
				throw new BadRequestException(Message.BAD_REQUEST);
			}

			//  Create appointment
			const appointment = await this.appointmentModel.create({
				patient: memberId,
				doctor,
				appointmentDate,
				timeSlot,
				consultationType,
				status: AppointmentStatus.SCHEDULED,
				reason,
				symptoms: symptoms || [],
				notes,
				consultationFee: targetDoctor.consultationFee,
				paymentStatus: PaymentStatus.PENDING,
				reminderSent: false,
			});

			await this.doctorService.doctorStatsEditor({
				_id: targetDoctor._id, // ✅ TO‘G‘RI
				targetKey: 'totalPatients',
				modifier: 1,
			});

			return appointment;
		} catch (err) {
			console.error('=== BOOK APPOINTMENT ERROR ===', err);
			throw new InternalServerErrorException(err);
		}
	}

	public async getMyAppointments(memberId: string, input: AppointmentsInquiry): Promise<Appointments> {
		const patientId = new Types.ObjectId(memberId);
		const { search } = input;
		const match: T = {
			patient: patientId,
		};
		const sort: T = {
			[input?.sort ?? 'appointmentDate']: input?.direction ?? Direction.DESC,
		};

		if (search?.status) {
			match.status = search.status;
		}
		if (search?.dateFrom || search?.dateTo) {
			match.appointmentDate = {};

			if (search.dateFrom) {
				match.appointmentDate.$gte = new Date(search.dateFrom);
			}

			if (search.dateTo) {
				match.appointmentDate.$lte = new Date(search.dateTo);
			}
		}

		const pipeline = [
			{ $match: match },
			{ $sort: sort },
			{
				$facet: {
					list: [
						{ $skip: (input.page - 1) * input.limit },
						{ $limit: input.limit },
						{
							$lookup: {
								from: 'doctors',
								localField: 'doctor',
								foreignField: '_id',
								as: 'doctorData',
							},
						},
						{
							$unwind: {
								path: '$doctorData',
								preserveNullAndEmptyArrays: true,
							},
						},
					],
					metaCounter: [{ $count: 'total' }],
				},
			},
		];

		const result = await this.appointmentModel.aggregate(pipeline);
		return result[0];
	}

	public async updateAppointment(memberId: ObjectId, input: AppointmentUpdate): Promise<Appointment> {
		const updateData: any = {};

		if (input.appointmentDate) updateData.appointmentDate = input.appointmentDate;
		if (input.timeSlot) updateData.timeSlot = input.timeSlot;
		if (input.symptoms) updateData.symptoms = input.symptoms;
		if (input.notes) updateData.notes = input.notes;

		const result = await this.appointmentModel
			.findOneAndUpdate(
				{
					_id: input._id,
					patient: memberId,
					status: AppointmentStatus.SCHEDULED,
				},
				{ $set: updateData },
				{ new: true },
			)
			.exec();

		if (!result) {
			throw new InternalServerErrorException(Message.UPDATE_FAILED);
		}

		return result;
	}

	public async getDoctorAppointments(doctorId: string, input: AppointmentsInquiry): Promise<Appointments> {
		const doctorObjectId = new Types.ObjectId(doctorId);
		const { search } = input;
		const match: T = {
			doctor: doctorObjectId,
		};
		const sort: T = {
			[input?.sort ?? 'appointmentDate']: input?.direction ?? Direction.DESC,
		};

		if (search?.status) {
			match.status = search.status;
		}
		if (search?.dateFrom || search?.dateTo) {
			match.appointmentDate = {};

			if (search.dateFrom) {
				match.appointmentDate.$gte = new Date(search.dateFrom);
			}
			if (search.dateTo) {
				match.appointmentDate.$lte = new Date(search.dateTo);
			}
		}

		const pipeline = [
			{ $match: match },
			{ $sort: sort },
			{
				$facet: {
					list: [
						{ $skip: (input.page - 1) * input.limit },
						{ $limit: input.limit },
						{
							$lookup: {
								from: 'members',
								localField: 'patient',
								foreignField: '_id',
								as: 'patientData',
							},
						},
						{
							$unwind: {
								path: '$patientData',
								preserveNullAndEmptyArrays: true,
							},
						},
					],
					metaCounter: [{ $count: 'total' }],
				},
			},
		];

		const result = await this.appointmentModel.aggregate(pipeline);

		return result[0];
	}

	public async cancelAppointment(memberId: string, appointmentId: ObjectId, reason: string): Promise<Appointment> {
		const appointment = await this.appointmentModel.findById(appointmentId).exec();

		if (!appointment) {
			throw new BadRequestException(Message.NO_DATA_FOUND);
		}

		// Ownership check
		if (appointment.patient.toString() !== memberId.toString()) {
			throw new BadRequestException('You can only cancel your own appointments');
		}

		// Status check
		if (![AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED].includes(appointment.status)) {
			throw new BadRequestException('Cannot cancel this appointment');
		}

		const result = await this.appointmentModel
			.findByIdAndUpdate(
				appointmentId,
				{
					$set: {
						status: AppointmentStatus.CANCELLED,
						cancelledBy: memberId,
						cancellationReason: reason,
						cancelledAt: new Date(),
					},
				},
				{ new: true },
			)
			.exec();

		if (!result) {
			throw new InternalServerErrorException(Message.UPDATE_FAILED);
		}

		await this.doctorService.doctorStatsEditor({
			_id: appointment.doctor,
			targetKey: 'totalPatients',
			modifier: -1,
		});

		return result;
	}

	public async getAllAppointmentByAdmin(input: AllAppointmentsInquiry): Promise<Appointments> {
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		const result = await this.appointmentModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							lookupMember,
							{
								$unwind: {
									path: '$memberData',
									preserveNullAndEmptyArrays: true,
								},
							},
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		return result[0];
	}

	public async updateAppointmentByAdmin(input: AppointmentUpdate): Promise<Appointment> {
		const { _id } = input;
		const result = await this.appointmentModel.findOneAndUpdate(_id, input, { new: true }).exec();

		if (!result) {
			throw new InternalServerErrorException(Message.UPDATE_FAILED);
		}

		return result;
	}

	public async removeAppointmentByAdmin(appointmentId: ObjectId): Promise<Appointment> {
		const appointment = await this.appointmentModel.findById(appointmentId).exec();

		if (!appointment) {
			throw new BadRequestException(Message.NO_DATA_FOUND);
		}

		if (appointment.status !== AppointmentStatus.CANCELLED) {
			throw new BadRequestException(Message.REMOVE_FAILED);
		}

		const result = await this.appointmentModel.findByIdAndDelete(appointmentId).exec();

		if (!result) {
			throw new InternalServerErrorException('Failed to remove appointment');
		}

		return result;
	}
}
