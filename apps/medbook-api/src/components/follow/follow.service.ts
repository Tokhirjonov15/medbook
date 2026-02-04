import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MemberService } from '../member/member.service';
import { Model, ObjectId } from 'mongoose';
import { Follower, Followers, Following, Followings } from '../../libs/dto/follow/follow';
import { Direction, Message } from '../../libs/enums/common.enum';
import { DoctorsService } from '../doctors/doctors.service';
import { FollowInquiry } from '../../libs/dto/follow/follow.input';
import {
	lookupAuthMemberFollowed,
	lookupAuthMemberLiked,
	lookupFollowingDataDoctor,
	lookupFollowingDataMember,
} from '../../libs/config';
import { T } from '../../libs/types/common';
import { Member } from '../../libs/dto/members/member';
import { Doctor } from '../../libs/dto/doctors/doctor';

@Injectable()
export class FollowService {
	constructor(
		@InjectModel('Follow') private readonly followModel: Model<Follower | Following>,
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		@InjectModel('Doctor') private readonly doctorModel: Model<Doctor>,
		private readonly memberService: MemberService,
		private readonly doctorService: DoctorsService,
	) {}

	public async subscribeMember(followerId: ObjectId, followingId: ObjectId): Promise<Follower> {
		if (followerId.toString() === followingId.toString()) {
			throw new InternalServerErrorException(Message.SELF_SUBSCRIPTION_DENIED);
		}

		const result = await this.registerSubscription(followerId, followingId);

		await this.memberService.memberStatsEditor({
			_id: followerId,
			targetKey: 'memberFollowings',
			modifier: 1,
		});
		await this.memberService.memberStatsEditor({
			_id: followingId,
			targetKey: 'memberFollowers',
			modifier: 1,
		});

		return result;
	}

	public async unsubscribeMember(followerId: ObjectId, followingId: ObjectId): Promise<Follower> {
		//@ts-ignore
		const targetMember = await this.memberService.getMember(null, followingId);
		if (!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const result = await this.followModel.findOneAndDelete({
			followingId: followingId,
			followerId: followerId,
		});
		if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		await this.memberService.memberStatsEditor({
			_id: followerId,
			targetKey: 'memberFollowings',
			modifier: -1,
		});
		await this.memberService.memberStatsEditor({
			_id: followingId,
			targetKey: 'memberFollowers',
			modifier: -1,
		});

		return result as Follower;
	}

	public async subscribeDoctor(followerId: ObjectId, doctorId: ObjectId): Promise<Follower> {
		const targetDoctor = await this.doctorService.getDoctor(followerId, doctorId);
		if (!targetDoctor) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const result = await this.registerSubscription(followerId, doctorId);

		await this.memberService.memberStatsEditor({
			_id: followerId,
			targetKey: 'memberFollowings',
			modifier: 1,
		});

		await this.doctorService.doctorStatsEditor({
			_id: doctorId,
			targetKey: 'memberFollowers',
			modifier: 1,
		});

		return result;
	}

	public async unsubscribeDoctor(followerId: ObjectId, doctorId: ObjectId): Promise<Follower> {
		const targetDoctor = await this.doctorService.getDoctor(followerId, doctorId);
		if (!targetDoctor) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const result = await this.followModel
			.findOneAndDelete({
				followingId: doctorId,
				followerId: followerId,
			})
			.lean()
			.exec();

		if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		await this.memberService.memberStatsEditor({
			_id: followerId,
			targetKey: 'memberFollowings',
			modifier: -1,
		});

		await this.doctorService.doctorStatsEditor({
			_id: doctorId,
			targetKey: 'memberFollowers',
			modifier: -1,
		});

		return result as Follower;
	}

	private async registerSubscription(followerId: ObjectId, followingId: ObjectId): Promise<Follower> {
		try {
			return (await this.followModel.create({
				followingId: followingId,
				followerId: followerId,
			})) as Follower;
		} catch (err) {
			console.log('Error, Service.model', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async getMemberFollowings(memberId: ObjectId, input: FollowInquiry): Promise<Followings> {
		const { page, limit, search } = input;
		if (!search?.followerId) throw new InternalServerErrorException(Message.BAD_REQUEST);

		const match: T = { followerId: search?.followerId };

		const result = await this.followModel
			.aggregate([
				{ $match: match },
				{ $sort: { createdAt: Direction.DESC } },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							...(memberId
								? [
										lookupAuthMemberLiked(memberId, '$followingId'),
										lookupAuthMemberFollowed({
											followerId: memberId,
											followingId: '$followingId',
										}),
										{
											$addFields: {
												meLiked: { $arrayElemAt: ['$meLiked', 0] },
												meFollowed: { $arrayElemAt: ['$meFollowed', 0] },
											},
										},
									]
								: [
										{
											$addFields: {
												meLiked: null,
												meFollowed: null,
											},
										},
									]),
							{
								$lookup: {
									from: 'members',
									localField: 'followingId',
									foreignField: '_id',
									as: 'memberData',
								},
							},
							{
								$lookup: {
									from: 'doctor',
									localField: 'followingId',
									foreignField: '_id',
									as: 'doctorData',
								},
							},
							{
								$unwind: {
									path: '$memberData',
									preserveNullAndEmptyArrays: true,
								},
							},
							{
								$unwind: {
									path: '$doctorData',
									preserveNullAndEmptyArrays: true,
								},
							},
							{
								$addFields: {
									followingData: {
										$ifNull: ['$memberData', '$doctorData'],
									},
								},
							},
							{
								$project: {
									memberData: 0,
									doctorData: 0,
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

	public async getMemberFollowers(memberId: ObjectId, input: FollowInquiry): Promise<Followers> {
		const { page, limit, search } = input;
		if (!search?.followingId) {
			throw new InternalServerErrorException(Message.BAD_REQUEST);
		}

		const match: T = { followingId: search?.followingId };

		const result = await this.followModel
			.aggregate([
				{ $match: match },
				{ $sort: { createdAt: Direction.DESC } },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							// Conditional lookup'lar
							...(memberId ? [
								lookupAuthMemberLiked(memberId, '$followerId'),
								lookupAuthMemberFollowed({
									followerId: memberId,
									followingId: '$followerId',
								}),
								// Array'dan object'ga aylantirish
								{
									$addFields: {
										meLiked: { $arrayElemAt: ['$meLiked', 0] },
										meFollowed: { $arrayElemAt: ['$meFollowed', 0] }
									}
								}
							] : [
								// Guest user uchun null qiymatlar
								{
									$addFields: {
										meLiked: null,
										meFollowed: null
									}
								}
							]),
							{
								$lookup: {
									from: 'members',
									localField: 'followerId',
									foreignField: '_id',
									as: 'memberData',
								},
							},
							{
								$lookup: {
									from: 'doctor',
									localField: 'followerId',
									foreignField: '_id',
									as: 'doctorData',
								},
							},
							{
								$unwind: {
									path: '$memberData',
									preserveNullAndEmptyArrays: true,
								},
							},
							{
								$unwind: {
									path: '$doctorData',
									preserveNullAndEmptyArrays: true,
								},
							},
							{
								$addFields: {
									followerData: {
										$ifNull: ['$memberData', '$doctorData'],
									},
								},
							},
							{
								$project: {
									memberData: 0,
									doctorData: 0,
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
}
