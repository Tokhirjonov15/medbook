import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberResolver } from './member.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.model';
import { AuthModule } from '../auth/auth.module';
import DoctorProfileSchema from '../../schemas/Doctor.model';
import { DoctorModule } from '../doctors/doctors.module';
import { ViewModule } from '../view/view.module';
import ViewSchema from '../../schemas/View.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: "Member", schema: MemberSchema},
      { name: 'Doctor', schema: DoctorProfileSchema },
      { name: 'View', schema: ViewSchema },
    ]),
    AuthModule,
    DoctorModule,
    ViewModule,
  ],
  providers: [MemberService, MemberResolver]
})
export class MemberModule {}
