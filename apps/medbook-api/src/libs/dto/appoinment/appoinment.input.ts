import { InputType, Field, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsEnum, IsArray, IsDateString, Min, IsString, IsDate } from 'class-validator';
import type { ObjectId } from 'mongoose';
import { ConsultationType } from '../../enums/consultation.enum';

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