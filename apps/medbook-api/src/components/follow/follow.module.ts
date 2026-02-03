import { Module } from '@nestjs/common';
import { FollowResolver } from './follow.resolver';
import { FollowService } from './follow.service';
import { MongooseModule } from '@nestjs/mongoose';
import FollowSchema from '../../schemas/Follow.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { DoctorModule } from '../doctors/doctors.module';
import MemberSchema from '../../schemas/Member.model';
import DoctorProfileSchema from '../../schemas/Doctor.model';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Follow', schema: FollowSchema }]),
		MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema }]),
		MongooseModule.forFeature([{ name: 'Doctor', schema: DoctorProfileSchema }]),
		AuthModule,
		MemberModule,
		DoctorModule,
	],
	providers: [FollowResolver, FollowService],
	exports: [FollowService],
})
export class FollowModule {}
