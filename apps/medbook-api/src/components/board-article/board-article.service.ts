import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { BoardArticle } from '../../libs/dto/board-article/board-article';
import { Model } from 'mongoose';

@Injectable()
export class BoardArticleService {
    constructor(
        @InjectModel('BoardArticle') private readonly boardArticleModel: Model<BoardArticle>,
        private memberService: MemberService,
        private viewService: ViewService,
    ) {}
}
