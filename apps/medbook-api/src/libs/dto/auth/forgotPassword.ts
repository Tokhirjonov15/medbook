import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class ForgotPasswordInput {
  @IsNotEmpty()
  @IsString()
  @Length(3, 15)
  @Field(() => String)
  memberNick: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  memberPhone: string;
}