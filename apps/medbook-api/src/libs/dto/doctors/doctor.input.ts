import { Field, InputType, Int, Float } from '@nestjs/graphql';
import { 
  IsNotEmpty,
  Length,
  IsOptional,
  IsArray,
  IsEnum,
  IsNumber,
  Min,
} from 'class-validator';
import { Gender } from '../../enums/gender.enum';
import { Specialization } from '../../enums/specialization.enum';
import { ConsultationType } from '../../enums/consultation.enum';

@InputType()
export class DoctorSignupInput {
  @IsNotEmpty()
  @Length(4, 15)
  @Field(() => String)
  memberNick: string;

  @IsNotEmpty()
  @Length(4, 100)
  @Field(() => String)
  memberFullName: string;

  @IsNotEmpty()
  @Length(5, 12)
  @Field(() => String)
  memberPassword: string;

  @IsNotEmpty()
  @Field(() => String)
  memberPhone: string;

  @IsNotEmpty()
  @Field(() => String)
  licenseNumber: string;

  @IsNotEmpty()
  @IsEnum(Specialization, { each: true })
  @Field(() => String) 
  specialization: string; 

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Field(() => Int)
  experience: number;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Field(() => Float)
  consultationFee: number;

  @IsOptional()
  @Field(() => Gender, { nullable: true })
  memberGender?: Gender;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  languages?: string[];

  @IsOptional()
  @IsEnum(ConsultationType)
  @Field(() => String, { nullable: true })
  consultationType?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberImage?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  memberDesc?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  workingDays?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  workingHours?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  breakTime?: string;
}