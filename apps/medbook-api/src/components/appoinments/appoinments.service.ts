import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import type { ObjectId } from 'mongoose';
import { Appointment, Appointments } from '../../libs/dto/appoinment/appoinment';
import { Direction, Message } from '../../libs/enums/common.enum';
import { AppointmentsInquiry, BookAppointmentInput } from '../../libs/dto/appoinment/appoinment.input';
import { AppointmentStatus } from '../../libs/enums/appoinment.enum';
import { PaymentStatus } from '../../libs/enums/payment.enum';
import { Doctor } from '../../libs/dto/doctors/doctor';
import { T } from '../../libs/types/common';

@Injectable()
export class AppoinmentsService {
    constructor(
        @InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>,
        @InjectModel('Doctor') private readonly doctorModel: Model<Doctor>,
    )  {}

    public async bookAppointment(
        memberId: ObjectId,
        input: BookAppointmentInput
    ): Promise<Appointment> {
        const { doctor, appointmentDate, timeSlot, consultationType, reason, symptoms, notes } = input;
        try {
            // 1. Check if doctor exists
            const targetDoctor = await this.doctorModel.findById(doctor).exec();
            if (!targetDoctor) {
                throw new BadRequestException(Message.NO_DATA_FOUND);
            }

            // 2. Check if doctor is available on the selected day
            const appointmentDay = new Date(appointmentDate)
                .toLocaleDateString('en-US', { weekday: 'long' })
                .toUpperCase();

            const isDoctorAvailable = targetDoctor.workingDays?.includes(appointmentDay);
            if (!isDoctorAvailable) {
                throw new BadRequestException(Message.SOMETHING_WENT_WRONG);
            }

            // 3. Check for overlapping appointment
            const appointmentDayStart = new Date(appointmentDate);
                appointmentDayStart.setHours(0, 0, 0, 0);

            const appointmentDayEnd = new Date(appointmentDate);
                appointmentDayEnd.setHours(23, 59, 59, 999);

            const overlappingAppointments = await this.appointmentModel.find({
                doctor,
                appointmentDate: { $gte: appointmentDayStart, $lte: appointmentDayEnd },
                status: { $in: [AppointmentStatus.SCHEDULED, AppointmentStatus.CONFIRMED] },
                $or: [
                    { 'timeSlot.start': { $lte: timeSlot.start }, 'timeSlot.end': { $gt: timeSlot.start } },
                    { 'timeSlot.start': { $lt: timeSlot.end }, 'timeSlot.end': { $gte: timeSlot.end } },
                    { 'timeSlot.start': { $gte: timeSlot.start }, 'timeSlot.end': { $lte: timeSlot.end } }
                ]
            }).exec();

            if (overlappingAppointments.length > 0) {
                throw new BadRequestException(Message.BAD_REQUEST);
            }

            // 5. Book the appointment
            const appointmentData = {
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
            };

            const result = await this.appointmentModel.create(appointmentData);
            return result;
        } catch (err: any) {
            console.error('=== BOOK APPOINTMENT ERROR ===');
            throw err;
        }
    }

    public async getMyAppointments(
        memberId: string,
        input: AppointmentsInquiry
    ): Promise<Appointments> {
        const patientId = new Types.ObjectId(memberId);
        const { search } = input;
        const match: T = {
            patient: patientId
        };
        const sort: T = {
            [input?.sort ?? 'appointmentDate']: input?.direction ?? Direction.DESC
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
                                as: 'doctorData'
                            }
                        },
                        {
                            $unwind: {
                                path: '$doctorData',
                                preserveNullAndEmptyArrays: true
                            }
                        }
                    ],
                    metaCounter: [{ $count: 'total' }]
                }
            }
        ];

        const result = await this.appointmentModel.aggregate(pipeline);
        return result[0];
    }

}
