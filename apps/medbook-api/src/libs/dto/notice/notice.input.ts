import { Field, InputType, Int } from "@nestjs/graphql";
import { IsEnum, IsIn, IsNotEmpty, IsOptional, Length, Min } from "class-validator";
import { NoticeStatus, NoticeTarget } from "../../enums/notice.enum";
import { Direction } from "../../enums/common.enum";
import { availableNoticeSorts } from "../../config";

@InputType()
export class NoticeInput {
    @IsNotEmpty()
    @Length(3, 120)
    @Field(() => String)
    title: string;

    @IsNotEmpty()
    @Length(3, 5000)
    @Field(() => String)
    content: string;

    @IsEnum(NoticeTarget)
    @Field(() => NoticeTarget, { defaultValue: NoticeTarget.ALL })
    target: NoticeTarget;
}

@InputType()
class NoticeSearch {
  @IsOptional()
  @Field(() => NoticeStatus, { nullable: true })
  status?: NoticeStatus;

  @IsOptional()
  @Field(() => NoticeTarget, { nullable: true })
  target?: NoticeTarget;

  @IsOptional()
  @Field(() => String, { nullable: true })
  text?: string;
}

@InputType()
export class NoticeInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableNoticeSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => NoticeSearch)
  search: NoticeSearch;
}
