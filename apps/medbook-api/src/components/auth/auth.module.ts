import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpModule } from "@nestjs/axios";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from '@nestjs/mongoose';
import { AuthResolver } from './auth.resolver';
import MemberSchema from '../../schemas/Member.model';
import DoctorProfileSchema from '../../schemas/Doctor.model';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: 'Member', schema: MemberSchema },
      { name: 'Doctor', schema: DoctorProfileSchema },
    ]),
    JwtModule.register({
      secret: `${process.env.SECRET_TOKEN}`,
      signOptions: {expiresIn: '30d'},
    }),
  ],
  providers: [AuthService, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
