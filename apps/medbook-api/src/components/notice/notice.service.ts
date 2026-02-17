import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Notice, Notices } from '../../libs/dto/notice/notice';
import { NoticeInquiry, NoticeInput } from '../../libs/dto/notice/notice.input';
import { UpdateNoticeInput } from '../../libs/dto/notice/notice.update';
import { Direction, Message } from '../../libs/enums/common.enum';
import { MemberType } from '../../libs/enums/member.enum';
import { NoticeStatus, NoticeTarget } from '../../libs/enums/notice.enum';
import { T } from '../../libs/types/common';

@Injectable()
export class NoticeService {
	constructor(@InjectModel('Notice') private readonly noticeModel: Model<Notice>) {}

	public async createNotice(memberId: ObjectId, input: NoticeInput): Promise<Notice> {
		try {
			const result = await this.noticeModel.create({
				...input,
				authorId: memberId,
			});
			return result;
		} catch (err: any) {
			console.log('Error, service. createNotice:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}
    
	public async getNotices(memberType: MemberType | null, input: NoticeInquiry): Promise<Notices> {
		const search = input.search ?? {};
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		// Only admin can query all statuses
		if (memberType === MemberType.ADMIN) {
			if (search.status) match.status = search.status;
		} else {
			match.status = NoticeStatus.ACTIVE;
		}

		// Admin may filter by a single target; users see role-based targets
		if (memberType === MemberType.ADMIN && search.target) {
			match.target = search.target;
		} else if (memberType === MemberType.DOCTOR) {
			match.target = { $in: [NoticeTarget.ALL, NoticeTarget.DOCTOR] };
		} else if (memberType === MemberType.PATIENT) {
			match.target = { $in: [NoticeTarget.ALL, NoticeTarget.PATIENT] };
		} else {
			match.target = NoticeTarget.ALL;
		}

		if (search.text) {
			match.$or = [
				{ title: { $regex: new RegExp(search.text, 'i') } },
				{ content: { $regex: new RegExp(search.text, 'i') } },
			];
		}

		const result = await this.noticeModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
							{
								$lookup: {
									from: 'members',
									localField: 'authorId',
									foreignField: '_id',
									as: 'memberData',
								},
							},
							{
								$addFields: {
									memberData: { $arrayElemAt: ['$memberData', 0] },
								},
							},
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async updateNoticeByAdmin(input: UpdateNoticeInput): Promise<Notice> {
		const result = await this.noticeModel
			.findOneAndUpdate(
				{
					_id: input._id,
				},
				input,
				{ new: true },
			)
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async removeNoticeByAdmin(noticeId: ObjectId): Promise<Notice> {
		const result = await this.noticeModel.findByIdAndDelete(noticeId).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
		return result;
	}
}
