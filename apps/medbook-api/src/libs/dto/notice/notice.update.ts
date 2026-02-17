import { Field, InputType } from "@nestjs/graphql";
import { IsEnum, IsOptional, Length } from "class-validator";
import { NoticeStatus, NoticeTarget } from "../../enums/notice.enum";

@InputType()
export class UpdateNoticeInput {
  @Field(() => String)
  _id: string;

  @IsOptional()
  @Length(3, 120)
  @Field(() => String, { nullable: true })
  title?: string;

  @IsOptional()
  @Length(3, 5000)
  @Field(() => String, { nullable: true })
  content?: string;

  @IsOptional()
  @IsEnum(NoticeTarget)
  @Field(() => NoticeTarget, { nullable: true })
  target?: NoticeTarget;

  @IsOptional()
  @IsEnum(NoticeStatus)
  @Field(() => NoticeStatus, { nullable: true })
  status?: NoticeStatus;
}
