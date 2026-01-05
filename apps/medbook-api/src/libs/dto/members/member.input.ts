import { Field, InputType } from '@nestjs/graphql';
import { 
  IsNotEmpty,
  Length,
  IsOptional,
} from 'class-validator';
import { Gender } from '../../enums/gender.enum';
import { MemberType } from '../../enums/member.enum';

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