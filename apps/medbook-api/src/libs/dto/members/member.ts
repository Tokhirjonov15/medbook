import { Field, ObjectType, ID, Int } from '@nestjs/graphql';
import { Gender } from '../../enums/gender.enum';
import type { ObjectId } from 'mongoose';
import { MemberStatus, MemberType } from '../../enums/member.enum';

@ObjectType()
export class Coordinates {
  @Field(() => Number)
  lat: number;

  @Field(() => Number)
  lng: number;
}

@ObjectType()
export class Address {
  @Field(() => String, { nullable: true })
  street?: string;

  @Field(() => String, { nullable: true })
  city?: string;

  @Field(() => String, { nullable: true })
  state?: string;

  @Field(() => String, { nullable: true })
  country?: string;

  @Field(() => String, { nullable: true })
  zipCode?: string;

  @Field(() => Coordinates, { nullable: true })
  coordinates?: Coordinates;
}

@ObjectType()
export class EmergencyContact {
  @Field(() => String)
  name: string;

  @Field(() => String)
  relationship: string;

  @Field(() => String)
  phone: string;
}

@ObjectType()
export class Member {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  memberNick: string;

  @Field(() => MemberType)
  memberType: MemberType;

  @Field(() => MemberStatus)
	memberStatus: MemberStatus;

  @Field(() => String)
  memberPhone: string;

  memberPassword?: string;

  @Field(() => String, { nullable: true })
  memberImage: string;

  @Field(() => Gender, { nullable: true })
  memberGender?: Gender;

  @Field(() => Int)
  memberArticles: number;

  @Field(() => Int)
  memberFollowers: number;

  @Field(() => Int)
  memberLikes: number;

  @Field(() => Int)
  memberFollowings: number;

  @Field(() => Int)
  memberComments: number;

  @Field(() => Int)
  memberWarnings: number;

  @Field(() => Int)
  memberBlocks: number;

  @Field(() => Address, { nullable: true })
  memberAddress?: Address;

  @Field(() => Boolean)
  isActive: boolean;

  @Field(() => Date, { nullable: true })
  lastLogin?: Date;

  @Field(() => String, { nullable: true })
  bloodGroup?: string;

  @Field(() => [String], { nullable: true })
  allergies?: string[];

  @Field(() => [String], { nullable: true })
  chronicDiseases?: string[];

  @Field(() => EmergencyContact, { nullable: true })
  emergencyContact?: EmergencyContact;

  @Field(() => ID, { nullable: true })
  doctorProfile?: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => String, { nullable: true })
  accessToken?: string;
}

@ObjectType()
export class Members {
    @Field(() => [Member])
    list: Member[];
}