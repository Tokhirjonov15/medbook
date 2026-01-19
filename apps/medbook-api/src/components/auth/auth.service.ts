import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { T } from '../../libs/types/common';
import { ForgotPasswordInput } from '../../libs/dto/auth/forgotPassword';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from '../../libs/dto/members/member';
import { Doctor } from '../../libs/dto/doctors/doctor';
import { ResetPasswordInput } from '../../libs/dto/auth/resetPassword';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel('Member') private readonly memberModel: Model<Member>,
		@InjectModel('Doctor') private readonly doctorModel: Model<Doctor>,
		private jwtService: JwtService,
	) {}

	public async hashPassword(password: string): Promise<string> {
		const salt = await bcrypt.genSalt();
		return await bcrypt.hash(password, salt);
	}

	public async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
		return await bcrypt.compare(password, hashedPassword);
	}

	public async createToken(user: any): Promise<string> {
		console.log('user:', user);
		const payload: T = {};

		Object.keys(user['_doc'] ? user['_doc'] : user).map((ele) => {
			payload[`${ele}`] = user[`${ele}`];
		});
		delete payload.memberPassword;

		return await this.jwtService.signAsync(payload);
	}

	public async verifyToken<T = any>(token: string): Promise<T> {
		const decoded = await this.jwtService.verifyAsync(token);
		return decoded;
	}

	public async verifyMemberCredentials(input: ForgotPasswordInput): Promise<boolean> {
		const { memberNick, memberPhone } = input;
		const member = await this.doctorModel
			.findOne({
				memberNick: memberNick,
				memberPhone: memberPhone,
			})
			.exec();

		if (member) {
			console.log('Member found:', memberNick);
			return true;
		}

		const doctor = await this.memberModel
			.findOne({
				memberNick: memberNick,
				memberPhone: memberPhone,
			})
			.exec();

		if (doctor) {
			console.log('Doctor found:', memberNick);
			return true;
		}

		console.log(' User not found or credentials mismatch');
		return false;
	}

	public async resetPassword(input: ResetPasswordInput): Promise<boolean> {
		const { memberNick, memberPhone, newPassword } = input;
		const hashedPassword = await this.hashPassword(newPassword);

		const memberUpdate = await this.memberModel
			.findOneAndUpdate(
				{
					memberNick: memberNick,
					memberPhone: memberPhone,
				},
				{
					$set: { memberPassword: hashedPassword },
				},
				{ new: true },
			)
			.exec();

		if (memberUpdate) {
			console.log('Member password updated:', memberNick);
			return true;
		}

		const doctorUpdate = await this.doctorModel
			.findOneAndUpdate(
				{
					memberNick: memberNick,
					memberPhone: memberPhone,
				},
				{
					$set: { memberPassword: hashedPassword },
				},
				{ new: true },
			)
			.exec();

		if (doctorUpdate) {
			console.log('✅ Doctor password updated:', memberNick);
			return true;
		}

		console.log('Password reset failed');
		return false;
	}
}
