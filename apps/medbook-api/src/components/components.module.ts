import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { AppoinmentsModule } from './appoinments/appoinments.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';
import { DoctorModule } from './doctors/doctors.module';

@Module({
  imports: [
    MemberModule,
    DoctorModule,
    AppoinmentsModule, 
    PrescriptionsModule, 
    MedicalRecordsModule, 
    ReviewsModule, 
    NotificationsModule, 
    ChatModule, 
    AuthModule,
  ],
})
export class ComponentsModule {}
