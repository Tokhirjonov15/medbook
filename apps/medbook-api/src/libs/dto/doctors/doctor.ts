import { Field, ObjectType, Int, Float } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { Gender } from '../../enums/gender.enum';
import { MemberStatus, MemberType } from '../../enums/member.enum';
import { Specialization } from '../../enums/specialization.enum';
import { MeLiked } from '../like/like';
import { MeFollowed } from '../follow/follow';

@ObjectType()
export class Doctor {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	memberNick: string;

	@Field(() => MemberStatus)
	memberStatus: MemberStatus;

	@Field(() => String)
	memberFullName: string;

	@Field(() => String)
	memberPhone: string;

	@Field(() => String)
	memberDesc: string;

	memberPassword?: string;

	@Field(() => Int)
	memberArticles: number;

	@Field(() => Int)
	memberFollowers: number;

	@Field(() => Int)
	memberFollowings: number;

	@Field(() => Int)
	memberComments: number;

	@Field(() => Int)
	memberWarnings: number;

	@Field(() => Int)
	memberBlocks: number;

	@Field(() => Int)
	memberLikes: number;

	@Field(() => String)
	licenseNumber: string;

	@Field(() => [Specialization])
	specialization: Specialization[];

	@Field(() => Int)
	experience: number;

	@Field(() => Float)
	consultationFee: number;

	@Field(() => MemberType)
	memberType: MemberType;

	@Field(() => Gender, { nullable: true })
	memberGender?: Gender;

	@Field(() => [String], { nullable: true })
	languages?: string[];

	@Field(() => String, { nullable: true })
	memberImage?: string;

	@Field(() => String, { nullable: true })
	accessToken?: string;

	@Field(() => String, { nullable: true })
	clinicAddress?: string;

	@Field(() => String, { nullable: true })
	clinicName?: string;

	@Field(() => [String], { nullable: true })
	workingDays?: string[];

	@Field(() => [String], { nullable: true })
	workingHours?: string[];

	@Field(() => [String], { nullable: true })
	breakTime?: string[];

	@Field(() => Int)
	doctorViews: number;

	@Field(() => Int)
	reviewCount: number;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation  */

	@Field(() => [MeLiked], { nullable: true })
	meLiked?: MeLiked[];

	@Field(() => [MeFollowed], {nullable: true})
	meFollowed?: MeFollowed[];
}

@ObjectType()
export class Doctors {
	@Field(() => [Doctor])
	list: Doctor[];

	@Field(() => [MetaCounter])
	metaCounter: MetaCounter[];
}

@ObjectType()
export class MetaCounter {
	@Field(() => Int)
	total: number;
}
