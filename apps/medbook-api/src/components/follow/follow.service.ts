import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MemberService } from '../member/member.service';
import { Model } from 'mongoose';
import { Follower, Following } from '../../libs/dto/follow/follow';

@Injectable()
export class FollowService {
    constructor(
        @InjectModel('Follow') private readonly followModel: Model<Follower | Following>,
        private readonly memberService: MemberService,
    ) {}
}
