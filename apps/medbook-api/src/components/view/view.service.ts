import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { T } from '../../libs/types/common';
import { View } from '../../libs/dto/view/view';
import { ViewInput } from '../../libs/dto/view/view.input';
import { OrdinaryInquiry } from '../../libs/dto/doctors/doctor.input';
import { ViewGroup } from '../../libs/enums/view.enum';
import { Doctor, Doctors } from '../../libs/dto/doctors/doctor';
import { lookupDoctorVisit } from '../../libs/config';

@Injectable()
export class ViewService {
	constructor(
		@InjectModel('View') private readonly viewModel: Model<View>,
		@InjectModel('Doctor') private readonly doctorModel: Model<Doctor>
	) {}

	public async recordView(input: ViewInput): Promise<View | null> {
		const viewExist = await this.checkViewExistance(input);
		if (!viewExist) {
			console.log('- New View Insert -');
			return await this.viewModel.create(input);
		} else return null;
	}

	private async checkViewExistance(input: ViewInput): Promise<View | null> {
		const { memberId, viewRefId } = input;
		const search: T = { memberId: memberId, viewRefId: viewRefId };
		return await this.viewModel.findOne(search).exec();
	}

	public async getVisitedDoctors(memberId: ObjectId, input: OrdinaryInquiry): Promise<Doctors> {
		const { page, limit } = input;
		const match: T = { viewGroup: ViewGroup.DOCTOR, memberId: memberId };
		const data: T = await this.viewModel
			.aggregate([
				{ $match: match },
				{ $sort: { updatedAt: -1 } },
				{
					$lookup: {
						from: 'doctor',
						localField: 'viewRefId',
						foreignField: '_id',
						as: 'visitedDoctor',
					},
				},
				{ $unwind: '$visitedDoctor' },
				{
					$facet: {
						list: [
							{ $skip: (page - 1) * limit },
							{ $limit: limit },
							{
								$lookup: {
									from: 'members',
									localField: 'visitedDoctor.memberId',
									foreignField: '_id',
									as: 'visitedDoctor.memberData',
								},
							},
							{ 
								$unwind: {
									path: '$visitedDoctor.memberData',
									preserveNullAndEmptyArrays: true
								}
							},
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();
		
		const result: Doctors = { 
			list: [], 
			metaCounter: data[0]?.metaCounter || [] 
		};
		result.list = data[0]?.list?.map((ele) => ele.visitedDoctor) || [];
		
		return result;
	}
}
