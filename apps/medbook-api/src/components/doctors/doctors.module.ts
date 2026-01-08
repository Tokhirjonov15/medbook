import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import DoctorProfileSchema from "../../schemas/Doctor.model";
import { AuthModule } from "../auth/auth.module";
import { DoctorsService } from './doctors.service';
import { DoctorsResolver } from './doctors.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{name: "Doctor", schema: DoctorProfileSchema}]), 
    AuthModule,
  ],
  providers: [DoctorsService, DoctorsResolver]
})
export class DoctorModule {}