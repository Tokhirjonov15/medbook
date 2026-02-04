import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ViewService } from './view.service';
import ViewSchema from '../../schemas/View.model';
import DoctorProfileSchema from '../../schemas/Doctor.model';
@Module({
	imports: [MongooseModule.forFeature([
		{ name: 'View', schema: ViewSchema },
		{ name: 'Doctor', schema: DoctorProfileSchema },
	])],
	providers: [ViewService],
	exports: [ViewService],
})
export class ViewModule {}
