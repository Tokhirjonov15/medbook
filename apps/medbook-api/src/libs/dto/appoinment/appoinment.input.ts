import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsEnum, IsArray, IsDateString, Min, IsString, IsDate } from 'class-validator';
import type { ObjectId } from 'mongoose';
import { ConsultationType } from '../../enums/consultation.enum';
import { AppointmentStatus } from '../../enums/appoinment.enum';
import { Direction } from '../../enums/common.enum';

@InputType()
export class TimeSlotInput {
    @IsNotEmpty()
    @Field(() => String)
    start: string;

    @IsNotEmpty()
    @Field(() => String)
    end: string;
}

@InputType()
export class BookAppointmentInput {
    @IsNotEmpty()
    @Field(() => String)
    doctor: ObjectId;

    @IsNotEmpty()
    @IsDate()
    @Field(() => Date)
    appointmentDate: Date;

    @IsNotEmpty()
    @Field(() => TimeSlotInput)
    timeSlot: TimeSlotInput;

    @IsNotEmpty()
    @IsEnum(ConsultationType)
    @Field(() => ConsultationType)
    consultationType: ConsultationType;

    @IsNotEmpty()
    @IsString()
    @Field(() => String)
    reason: string;

    @IsOptional()
    @IsArray()
    @Field(() => [String], { nullable: true })
    symptoms?: string[];

    @IsOptional()
    @Field(() => String, { nullable: true })
    notes?: string;
}

@InputType()
export class AppointmentsInquirySearch {
    @IsOptional()
    @Field(() => String, { nullable: true })
    doctorId?: ObjectId;

    @IsOptional()
    @Field(() => String, { nullable: true })
    patientId?: ObjectId;

    @IsOptional()
    @Field(() => AppointmentStatus, { nullable: true })
    status?: AppointmentStatus;

    @IsOptional()
    @Field(() => Date, { nullable: true })
    dateFrom?: Date;

    @IsOptional()
    @Field(() => Date, { nullable: true })
    dateTo?: Date;
}

@InputType()
export class AppointmentsInquiry {
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @Field(() => String, { nullable: true })
    sort?: string;

    @IsOptional()
    @Field(() => Direction, { nullable: true })
    direction?: Direction;

    @IsOptional()
    @Field(() => AppointmentsInquirySearch, { nullable: true })
    search?: AppointmentsInquirySearch;
}