import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor, Doctors } from '../../libs/dto/doctors/doctor';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { DoctorSignupInput } from '../../libs/dto/doctors/doctor.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { DoctorsInquiry, LoginInput } from '../../libs/dto/members/member.input';
import { T } from '../../libs/types/common';
import { DoctorUpdate } from '../../libs/dto/doctors/doctor.update';

@Injectable()
export class DoctorsService {
	constructor(
		@InjectModel('Doctor') private readonly memberModel: Model<Doctor>,
		private authService: AuthService,
	) {}

	public async doctorSignup(input: DoctorSignupInput): Promise<Doctor> {
		input.memberPassword = await this.authService.hashPassword(input.memberPassword);
		try {
			const result = await this.memberModel.create(input);
			result.accessToken = await this.authService.createToken(result);

			return result;
		} catch (err) {
			console.log('ERROR, service.model:', err.message);
			throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
		}
	}

	public async DoctorLogin(input: LoginInput): Promise<Doctor> {
		const { memberNick, memberPassword } = input;
		const response = await this.memberModel
			.findOne({ memberNick: memberNick })
			.select('+memberPassword')
			.exec();
		
		if (!response) {
			throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
		}
		if (!response.memberPassword) {
			throw new InternalServerErrorException(Message.WRONG_PASSWORD);
		}

		const isMatch = await this.authService.comparePassword(
			memberPassword, 
			response.memberPassword
		);
		if (!isMatch) {
			throw new InternalServerErrorException(Message.WRONG_PASSWORD);
		}

		response.memberPassword = undefined;
		response.accessToken = await this.authService.createToken(response);
		
		return response;
	}

	public async getAllDoctorsByAdmin(input: DoctorsInquiry): Promise<Doctors> {
		const { text } = input.search;
		const match: T = {};
		const sort: T = { [input?.sort ?? "createdAt"]: input?.direction ?? Direction.DESC };

		if (text) {
			match.$or = [
				{ memberNick: { $regex: new RegExp(text, "i") } },
				{ memberFullName: { $regex: new RegExp(text, "i") } },
				{ specializations: { $in: [new RegExp(text, "i")] } }
			];
		}

		const result = await this.memberModel.aggregate([
			{ $match: match },
			{ $sort: sort },
			{
				$facet: {
					list: [
						{ $skip: (input.page - 1) * input.limit }, 
						{ $limit: input.limit }
					],
					metaCounter: [{ $count: "total" }],
				},
			},
		]).exec();

		if (!result.length || !result[0].list.length) {
			throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		}

		return result[0];
	}

	public async updateDoctorByAdmin(input: DoctorUpdate): Promise<Doctor> {
        const { _id, ...updateData } = input;
        const result = await this.memberModel
            .findByIdAndUpdate(
                _id,
                updateData,
                { new: true }
            )
            .exec();
			
        if (!result) {
            throw new InternalServerErrorException(Message.UPDATE_FAILED);
        }

        return result;
    }
}
