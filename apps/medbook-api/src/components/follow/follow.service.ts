import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MemberService } from '../member/member.service';
import { Model, ObjectId } from 'mongoose';
import { Follower, Following } from '../../libs/dto/follow/follow';
import { Message } from '../../libs/enums/common.enum';
import { DoctorsService } from '../doctors/doctors.service';

@Injectable()
export class FollowService {
	constructor(
		@InjectModel('Follow') private readonly followModel: Model<Follower | Following>,
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

		return result;
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

		return result;
	}

	private async registerSubscription(followerId: ObjectId, followingId: ObjectId): Promise<Follower> {
		try {
			return await this.followModel.create({
				followingId: followingId,
				followerId: followerId,
			});
		} catch (err) {
			console.log('Error, Service.model', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}
}
