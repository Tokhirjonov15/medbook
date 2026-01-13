import { ObjectType, Field, Int, Float } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { Doctor, MetaCounter } from '../doctors/doctor';
import { ConsultationType } from '../../enums/consultation.enum';
import { AppointmentStatus } from '../../enums/appoinment.enum';
import { PaymentStatus } from '../../enums/payment.enum';
import { Member } from '../members/member';

@ObjectType()
export class TimeSlot {
    @Field(() => String)
    start: string;

    @Field(() => String)
    end: string;
}

@ObjectType()
export class Appointment {
    @Field(() => String)
    _id: ObjectId;

    @Field(() => String)
    patient: ObjectId;

    @Field(() => String)
    doctor: ObjectId;

    @Field(() => Date)
    appointmentDate: Date;

    @Field(() => TimeSlot)
    timeSlot: TimeSlot;

    @Field(() => ConsultationType)
    consultationType: ConsultationType;

    @Field(() => AppointmentStatus)
    status: AppointmentStatus;

    @Field(() => String)
    reason: string;

    @Field(() => [String], { nullable: true })
    symptoms?: string[];

    @Field(() => String, { nullable: true })
    notes?: string;

    @Field(() => Float)
    consultationFee: number;

    @Field(() => PaymentStatus)
    paymentStatus: PaymentStatus;

    @Field(() => Date, { nullable: true })
    paidAt?: Date;

    @Field(() => String, { nullable: true })
    meetingLink?: string;

    @Field(() => String, { nullable: true })
    meetingId?: string;

    @Field(() => Date, { nullable: true })
    followUpDate?: Date;

    @Field(() => String, { nullable: true })
    cancelledBy?: ObjectId;

    @Field(() => String, { nullable: true })
    cancellationReason?: string;

    @Field(() => Date, { nullable: true })
    cancelledAt?: Date;

    @Field(() => Boolean)
    reminderSent: boolean;

    @Field(() => Date, { nullable: true })
    completedAt?: Date;

    @Field(() => Int, { nullable: true })
    duration?: number;

    @Field(() => Date)
    createdAt: Date;

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => Member, { nullable: true })
    patientData?: Member;

    @Field(() => Doctor, { nullable: true })
    doctorData?: Doctor;
}

@ObjectType()
export class Appointments {
    @Field(() => [Appointment])
    list: Appointment[];

    @Field(() => [MetaCounter])
    metaCounter: MetaCounter[];
}