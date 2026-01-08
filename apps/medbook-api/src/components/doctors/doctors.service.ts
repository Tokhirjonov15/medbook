import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor } from '../../libs/dto/doctors/doctor';
import { Model } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { DoctorSignupInput } from '../../libs/dto/doctors/doctor.input';
import { Message } from '../../libs/enums/common.enum';

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
}
