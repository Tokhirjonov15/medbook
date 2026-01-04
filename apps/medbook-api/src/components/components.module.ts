import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { DoctorsModule } from './doctors/doctors.module';
import { AppoinmentsModule } from './appoinments/appoinments.module';
import { PrescriptionsModule } from './prescriptions/prescriptions.module';
import { MedicalRecordsModule } from './medical-records/medical-records.module';
import { ReviewsModule } from './reviews/reviews.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ChatModule } from './chat/chat.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    MemberModule, 
    DoctorsModule, 
    AppoinmentsModule, 
    PrescriptionsModule, 
    MedicalRecordsModule, 
    ReviewsModule, 
    NotificationsModule, 
    ChatModule, 
    EmailModule,
  ],
})
export class ComponentsModule {}
