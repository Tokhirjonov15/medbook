// src/auth/dto/signup.input.ts
import { Field, InputType } from '@nestjs/graphql';
import { 
  IsNotEmpty,
  Length,
  IsOptional,
} from 'class-validator';
import { Gender } from '../../enums/gender.enum';
import { UserRole } from '../../enums/member.enum';

@InputType()
export class SignupInput {
  @IsNotEmpty()
  @Length(2, 50)
  @Field(() => String)
  firstName: string;

  @IsNotEmpty()
  @Length(2, 50)
  @Field(() => String)
  lastName: string;

  @IsNotEmpty() 
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @Length(5, 12)
  @Field(() => String)
  password: string;

  @IsNotEmpty()
  @Field(() => UserRole)
  role: UserRole;

  @IsNotEmpty()
  @Field(() => String)
  phone: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  dateOfBirth?: string;

  @IsOptional()
  @Field(() => Gender, { nullable: true })
  gender?: Gender;
}

@InputType()
export class LoginInput {
  @IsNotEmpty() 
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @Length(5, 12)
  @Field(() => String)
  password: string;
}