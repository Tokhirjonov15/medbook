import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, Length, IsOptional, Min, IsIn } from 'class-validator';
import { Gender } from '../../enums/gender.enum';
import { MemberType } from '../../enums/member.enum';
import { availableDoctorSorts, availableMemberSorts } from '../../config';
import { Direction } from '../../enums/common.enum';
import type { ObjectId } from 'mongoose';
import { Specialization } from '../../enums/specialization.enum';
import { ConsultationType } from '../../enums/consultation.enum';

@InputType()
export class SignupInput {
	@IsNotEmpty()
	@Length(4, 15)
	@Field(() => String)
	memberNick: string;

	@IsNotEmpty()
	@Length(5, 12)
	@Field(() => String)
	memberPassword: string;

	@IsOptional()
	@Field(() => MemberType, { nullable: true })
	memberType?: MemberType;

	@IsNotEmpty()
	@Field(() => String)
	memberPhone: string;

	@IsOptional()
	@Field(() => Gender, { nullable: true })
	memberGender?: Gender;
}

@InputType()
export class LoginInput {
	@IsNotEmpty()
	@Length(4, 15)
	@Field(() => String)
	memberNick: string;

	@IsNotEmpty()
	@Length(5, 12)
	@Field(() => String)
	memberPassword: string;
}

@InputType()
export class PricesRange {
	@Field(() => Int)
	start: number;

	@Field(() => Int)
	end: number;
}

@InputType()
class DISearch {
	@IsOptional()
	@Field(() => String, { nullable: true })
	memberId?: ObjectId;

	@IsOptional()
	@Field(() => Specialization, { nullable: true })
	specializationList?: Specialization;

	@IsOptional()
	@Field(() => ConsultationType, { nullable: true })
	consultationTypeList?: ConsultationType;

	@IsOptional()
	@Field(() => PricesRange, { nullable: true })
	pricesRange?: PricesRange;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;

	@IsOptional()
	@Field(() => String, { nullable: true })
	location?: string;
}

@InputType()
export class DoctorsInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableDoctorSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => DISearch)
	search: DISearch;
}

@InputType()
class MISearch {
	@IsOptional()
	@Field(() => MemberType, { nullable: true })
	memberType?: MemberType;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class MembersInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableMemberSorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => MISearch)
	search: MISearch;
}
