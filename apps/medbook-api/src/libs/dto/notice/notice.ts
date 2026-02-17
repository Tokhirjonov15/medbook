import { Field, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { MetaCounter } from '../doctors/doctor';
import { Member } from '../members/member';
import { NoticeStatus, NoticeTarget } from '../../enums/notice.enum';

@ObjectType()
export class Notice {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => String)
	title: string;

	@Field(() => String)
	content: string;

	@Field(() => NoticeStatus)
	status: NoticeStatus;

	@Field(() => NoticeTarget)
	target: NoticeTarget;

	@Field(() => String)
	authorId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/** from aggregation */
	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Notices {
	@Field(() => [Notice])
	list: Notice[];

	@Field(() => [MetaCounter], { nullable: true })
	metaCounter: MetaCounter[];
}

