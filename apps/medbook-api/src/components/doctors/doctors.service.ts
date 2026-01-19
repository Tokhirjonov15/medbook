import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor, Doctors } from '../../libs/dto/doctors/doctor';
import { Model, ObjectId, Types } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { DoctorSignupInput } from '../../libs/dto/doctors/doctor.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { DoctorsInquiry, LoginInput } from '../../libs/dto/members/member.input';
import { StatisticModifier, T } from '../../libs/types/common';
import { DoctorUpdate } from '../../libs/dto/doctors/doctor.update';
import { ViewInput } from '../../libs/dto/view/view.input';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ViewService } from '../view/view.service';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { MemberStatus } from '../../libs/enums/member.enum';
import { LikeService } from '../like/like.service';

@Injectable()
export class DoctorsService {
	constructor(
		@InjectModel('Doctor') private readonly doctorModel: Model<Doctor>,
		private authService: AuthService,
		private viewService: ViewService,
		private likeService: LikeService,
	) {}

	public async doctorSignup(input: DoctorSignupInput): Promise<Doctor> {
		input.memberPassword = await this.authService.hashPassword(input.memberPassword);
		try {
			const result = await this.doctorModel.create(input);
			result.accessToken = await this.authService.createToken(result);
			return result;
		} catch (err) {
			console.log('ERROR, service.model:', err.message);
			throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
		}
	}

	public async DoctorLogin(input: LoginInput): Promise<Doctor> {
		const { memberNick, memberPassword } = input;
		const response = await this.doctorModel.findOne({ memberNick: memberNick }).select('+memberPassword').exec();

		if (!response) {
			throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
		}
		if (!response.memberPassword) {
			throw new InternalServerErrorException(Message.WRONG_PASSWORD);
		}

		const isMatch = await this.authService.comparePassword(memberPassword, response.memberPassword);
		if (!isMatch) {
			throw new InternalServerErrorException(Message.WRONG_PASSWORD);
		}

		response.memberPassword = undefined;
		response.accessToken = await this.authService.createToken(response);

		return response;
	}

	public async updateDoctor(memberId: ObjectId, input: DoctorUpdate): Promise<Doctor> {
		const objectId = typeof memberId === 'string' ? new Types.ObjectId(memberId) : memberId;

		console.log('objectId:', objectId);
		const existingDoctor = await this.doctorModel.findById(objectId).exec();

		if (!existingDoctor) {
			console.log('No doctor found with ID:', objectId);
			throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		}

		const result = await this.doctorModel
			.findByIdAndUpdate(objectId, { $set: input }, { new: true, runValidators: true })
			.exec();
		if (!result) {
			throw new InternalServerErrorException(Message.UPDATE_FAILED);
		}

		result.accessToken = await this.authService.createToken(result);
		return result;
	}

	public async getDoctor(memberId: ObjectId, doctorId: ObjectId): Promise<Doctor> {
		const search: T = {
			_id: doctorId,
		};

		const targetDoctor = await this.doctorModel.findOne(search).lean().exec();

		if (!targetDoctor) {
			throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		}
		if (memberId) {
			const viewInput: ViewInput = {
				memberId: memberId,
				viewRefId: doctorId,
				viewGroup: ViewGroup.DOCTOR,
			};
			const newView = await this.viewService.recordView(viewInput);

			if (newView) {
				await this.doctorModel.findByIdAndUpdate(doctorId, { $inc: { doctorViews: 1 } }, { new: true }).exec();

				targetDoctor.doctorViews++;
			}
			const likeInput = { memberId: memberId, likeRefId: doctorId, likeGroup: LikeGroup.DOCTOR };
			//@ts-ignore
			targetDoctor.meLiked = await this.likeService.checkLikeExistence(likeInput);
		}

		return targetDoctor;
	}

	public async likeTargetDoctor(memberId: ObjectId, likeRefId: ObjectId): Promise<Doctor> {
		const target = await this.doctorModel.findOne({ _id: likeRefId, memberStatus: MemberStatus.ACTIVE }).exec();
		if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

		const input: LikeInput = {
			memberId: memberId,
			likeRefId: likeRefId,
			likeGroup: LikeGroup.DOCTOR,
		};

		const modifier: number = await this.likeService.toggleLike(input);
		const result = await this.doctorStatsEditor({ _id: likeRefId, targetKey: 'memberLikes', modifier: modifier });

		if (!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
		return result;
	}

	public async getAllDoctorsByAdmin(input: DoctorsInquiry): Promise<Doctors> {
		const { text } = input.search;
		const match: T = {};
		const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

		if (text) {
			match.$or = [
				{ memberNick: { $regex: new RegExp(text, 'i') } },
				{ memberFullName: { $regex: new RegExp(text, 'i') } },
				{ specializations: { $in: [new RegExp(text, 'i')] } },
			];
		}

		const result = await this.doctorModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				{
					$facet: {
						list: [{ $skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length || !result[0].list.length) {
			throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		}

		return result[0];
	}

	public async updateDoctorByAdmin(input: DoctorUpdate): Promise<Doctor> {
		const { _id, ...updateData } = input;

		const result = await this.doctorModel
			.findByIdAndUpdate(_id, { $set: updateData }, { new: true, runValidators: true })
			.exec();

		if (!result) {
			throw new InternalServerErrorException(Message.UPDATE_FAILED);
		}

		return result;
	}

	public async doctorStatsEditor(input: StatisticModifier): Promise<Doctor> {
		const { _id, targetKey, modifier } = input;
		const result = await this.doctorModel
			.findByIdAndUpdate(
				_id,
				{
					$inc: { [targetKey]: modifier },
				},
				{ new: true },
			)
			.exec();
		if (!result) {
			throw new InternalServerErrorException(Message.UPDATE_FAILED);
		}

		return result;
	}
}
