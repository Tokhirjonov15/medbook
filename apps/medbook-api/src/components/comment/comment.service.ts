import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MemberService } from '../member/member.service';
import { BoardArticleService } from '../board-article/board-article.service';
import { Model } from 'mongoose';
import { Comment } from '../../libs/dto/comment/comment';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel('Comment') private readonly commentModel: Model<Comment>,
        private readonly memberService: MemberService,
        private readonly boardArticleService: BoardArticleService,
    ) {}
}
