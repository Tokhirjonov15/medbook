import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional } from "class-validator";
import type { ObjectId } from "mongoose";

@InputType('AppointmentTimeSlotInput')
export class TimeSlotInput {
    @Field(() => String)
    start: string;

    @Field(() => String)
    end: string;
}

@InputType()
export class AppointmentUpdate {
    @IsNotEmpty()
    @Field(() => String)
    _id: ObjectId;

    @IsOptional()
    @Field(() => Date, { nullable: true })
    appointmentDate?: Date;

    @IsOptional()
    @Field(() => TimeSlotInput, { nullable: true })
    timeSlot?: TimeSlotInput;

    @IsOptional()
    @Field(() => [String], { nullable: true })
    symptoms?: string[];

    @IsOptional()
    @Field(() => String, { nullable: true })
    notes?: string;
}

