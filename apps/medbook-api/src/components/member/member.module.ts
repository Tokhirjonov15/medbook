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
import { LikeModule } from '../like/like.module';

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
    LikeModule,
  ],
  providers: [MemberService, MemberResolver],
  exports: [MemberService],
})
export class MemberModule {}
