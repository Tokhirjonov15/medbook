import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Doctor } from 'apps/medbook-api/src/libs/dto/doctors/doctor';
import { MemberStatus, MemberType } from 'apps/medbook-api/src/libs/enums/member.enum';
import { Model } from 'mongoose';

@Injectable()
export class BatchService {
	constructor(@InjectModel('Doctor') private readonly doctorModel: Model<Doctor>) {}

	public async batchDoctors(): Promise<void> {
		const doctors: Doctor[] = await this.doctorModel
			.find({
				memberType: MemberType.DOCTOR,
				memberStatus: MemberStatus.ACTIVE,
			})
			.exec();
	}

	getHello(): string {
		return 'Welcome to Nestar BATCH Server!';
	}
}
