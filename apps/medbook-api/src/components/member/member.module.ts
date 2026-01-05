import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberResolver } from './member.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import UserSchema from '../../schemas/Member.model';

@Module({
  imports: [
    MongooseModule.forFeature([{name: "Member", schema: UserSchema}])
  ],
  providers: [MemberService, MemberResolver]
})
export class MemberModule {}
