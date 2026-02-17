import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, Length } from 'class-validator';

@InputType()
export class AiChatInput {
	@IsNotEmpty()
	@Length(1, 2000)
	@Field(() => String)
	message: string;
}
