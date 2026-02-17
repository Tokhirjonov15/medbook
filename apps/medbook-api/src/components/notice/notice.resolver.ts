import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NoticeService } from './notice.service';
import { UseGuards } from '@nestjs/common';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { NoticeInquiry, NoticeInput } from '../../libs/dto/notice/notice.input';
import { UpdateNoticeInput } from '../../libs/dto/notice/notice.update';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { MemberType } from '../../libs/enums/member.enum';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver()
export class NoticeResolver {
	constructor(private readonly noticeService: NoticeService) {}

	@UseGuards(WithoutGuard)
	@Query((returns) => Notices)
	public async getNotices(
		@Args('input') input: NoticeInquiry,
		@AuthMember('memberType') memberType: MemberType,
	): Promise<Notices> {
		console.log('Query: getNotices');
		return await this.noticeService.getNotices(memberType ?? null, input);
	}

	/** ADMIN */
	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Notice)
	public async createNotice(
		@Args('input') input: NoticeInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Notice> {
		console.log('Mutation: createNotice');
		return await this.noticeService.createNotice(memberId, input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Notice)
	public async updateNoticeByAdmin(@Args('input') input: UpdateNoticeInput): Promise<Notice> {
		console.log('Mutation: updateNoticeByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.noticeService.updateNoticeByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Notice)
	public async removeNoticeByAdmin(@Args('noticeId') input: string): Promise<Notice> {
		console.log('Mutation: removeNoticeByAdmin');
		const noticeId = shapeIntoMongoObjectId(input);
		return await this.noticeService.removeNoticeByAdmin(noticeId);
	}
}
