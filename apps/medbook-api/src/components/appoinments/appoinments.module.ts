import { Module } from '@nestjs/common';
import { AppoinmentsResolver } from './appoinments.resolver';
import { AppoinmentsService } from './appoinments.service';
import { MongooseModule } from '@nestjs/mongoose';
import AppointmentSchema from '../../schemas/Appoinment.model';
import DoctorProfileSchema from '../../schemas/Doctor.model';
import { AuthModule } from '../auth/auth.module';
import { DoctorModule } from '../doctors/doctors.module';

@Module({
  imports: [
        MongooseModule.forFeature([
            { name: 'Appointment', schema: AppointmentSchema },
            { name: 'Doctor', schema: DoctorProfileSchema },
        ]),
        AuthModule,
        DoctorModule,
    ],
    providers: [AppoinmentsService, AppoinmentsResolver],
    exports: [AppoinmentsService],
})
export class AppoinmentsModule {}
