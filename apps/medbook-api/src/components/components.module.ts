import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { DoctorsModule } from './doctors/doctors.module';

@Module({
  imports: [MemberModule, DoctorsModule]
})
export class ComponentsModule {}
