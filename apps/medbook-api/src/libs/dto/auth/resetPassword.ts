import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@InputType()
export class ResetPasswordInput {
    @IsNotEmpty()
    @IsString()
    @Length(4, 15)
    @Field(() => String)
    memberNick: string;

    @IsNotEmpty()
    @IsString()
    @Field(() => String)
    memberPhone: string;

    @IsNotEmpty()
    @IsString()
    @Length(5, 12)
    @Field(() => String)
    newPassword: string;
}