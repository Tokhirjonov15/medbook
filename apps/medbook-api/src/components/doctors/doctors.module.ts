import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import DoctorProfileSchema from '../../schemas/Doctor.model';
import { AuthModule } from '../auth/auth.module';
import { DoctorsService } from './doctors.service';
import { DoctorsResolver } from './doctors.resolver';
import { ViewModule } from '../view/view.module';
import ViewSchema from '../../schemas/View.model';
import MemberSchema from '../../schemas/Member.model';
import { LikeModule } from '../like/like.module';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Doctor', schema: DoctorProfileSchema },
			{ name: 'Member', schema: MemberSchema },
			{ name: 'View', schema: ViewSchema },
		]),
		AuthModule,
		ViewModule,
		LikeModule,
	],
	providers: [DoctorsService, DoctorsResolver],
	exports: [DoctorsService],
})
export class DoctorModule {}
