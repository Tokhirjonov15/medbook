import { Field, ObjectType, Int, Float } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { Gender } from '../../enums/gender.enum';
import { MemberType } from '../../enums/member.enum';

@ObjectType()
export class Doctor {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => String)
  memberNick: string;

  @Field(() => String)
  memberFullName: string;

  @Field(() => String)
  memberPhone: string;

  memberPassword?: string;

  @Field(() => String)
  licenseNumber: string;

  @Field(() => String)
  specialization: string;

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

  @Field(() => Int)
  DoctorViews: number;

  @Field(() => Int)
  reviewCount: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}