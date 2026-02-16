import { InputType, Field, Int, Float } from '@nestjs/graphql';
import { IsOptional, IsArray, IsEnum, IsNumber, Min, Length } from 'class-validator';
import type { ObjectId } from 'mongoose';
import { Gender } from '../../enums/gender.enum';
import { MemberStatus } from '../../enums/member.enum';
import { Specialization } from '../../enums/specialization.enum';

@InputType()
export class DoctorUpdate {
	@Field(() => String)
	_id?: ObjectId;

	@IsOptional()
	@Length(3, 15)
	@Field(() => String, { nullable: true })
	memberNick?: string;

	@IsOptional()
	@IsEnum(MemberStatus)
	@Field(() => MemberStatus, { nullable: true })
	memberStatus?: MemberStatus;

	@IsOptional()
	@Length(5, 12)
	@Field(() => String, { nullable: true })
	memberPassword?: string;

	@IsOptional()
	@Length(4, 100)
	@Field(() => String, { nullable: true })
	memberFullName?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	memberPhone?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	memberImage?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	memberDesc?: string;

	@IsOptional()
	@Field(() => Gender, { nullable: true })
	memberGender?: Gender;

	@IsOptional()
	@Field(() => String, { nullable: true })
	licenseNumber?: string;

	@IsOptional()
	@IsArray()
	@IsEnum(Specialization, { each: true })
	@Field(() => [Specialization], { nullable: true })
	specialization?: Specialization[];

	@IsOptional()
	@Min(0)
	@Field(() => Int, { nullable: true })
	experience?: number;

	@IsOptional()
	@Field(() => Float, { nullable: true })
	consultationFee?: number;

	@IsOptional()
	@IsArray()
	@Field(() => [String], { nullable: true })
	languages?: string[];

	@IsOptional()
	@Field(() => String, { nullable: true })
	consultationType?: string;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	workingDays?: string[];

	@IsOptional()
	@Field(() => [String], { nullable: true })
	workingHours?: string[];

	@IsOptional()
	@Field(() => [String], { nullable: true })
	breakTime?: string[];

	@IsOptional()
	@Field(() => String, { nullable: true })
	clinicAddress?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	clinicName?: string;

	@IsOptional()
	@IsArray()
	@Field(() => [String], { nullable: true })
	awards?: string[];
}
