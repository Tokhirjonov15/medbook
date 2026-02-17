import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AiChatResponse {
	@Field(() => String)
	reply: string;
}
