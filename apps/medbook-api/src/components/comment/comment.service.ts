import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { MemberService } from '../member/member.service';
import { BoardArticleService } from '../board-article/board-article.service';
import { Model, ObjectId } from 'mongoose';
import { Comment, Comments } from '../../libs/dto/comment/comment';
import { CommentInput, CommentsInquiry } from '../../libs/dto/comment/comment.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { DoctorsService } from '../doctors/doctors.service';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { lookupMember } from '../../libs/config';
import { StatisticModifier, T } from '../../libs/types/common';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeService } from '../like/like.service';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel('Comment') private readonly commentModel: Model<Comment>,
        private readonly memberService: MemberService,
        private readonly boardArticleService: BoardArticleService,
        private readonly doctorService: DoctorsService,
        private readonly likeService: LikeService,
    ) {}

    public async createComment(memberId: ObjectId, input: CommentInput): Promise<Comment> {
        input.memberId = memberId;
        let result: Comment | null = null;
        
        try {
            result = await this.commentModel.create(input);
        } catch (err) {
            console.log("Error, Service.model: Comment", err.message);
            throw new BadRequestException(Message.CREATE_FAILED);
        }

        switch (input.commentGroup) {
            case CommentGroup.ARTICLE:
                await this.boardArticleService.boardArticleStatsEditor({
                    _id: input.commentRefId,
                    targetKey: "articleComments",
                    modifier: 1,
                });
            break;
            case CommentGroup.MEMBER:
                await this.memberService.memberStatsEditor({
                    _id: input.commentRefId,
                    targetKey: "memberComments",
                    modifier: 1,
                });
            break;            
            case CommentGroup.DOCTOR:
                await this.doctorService.doctorStatsEditor({
                    _id: input.commentRefId,
                    targetKey: "memberComments",
                    modifier: 1,
                });
            break;
            case CommentGroup.COMMENT:
                await this.commentModel.findByIdAndUpdate(
                    input.commentRefId,
                    { $inc: { commentReplies: 1 } }
                ).exec();
            break;
        }
        
        console.log("result:", result);
        
        if(!result) throw new InternalServerErrorException(Message.CREATE_FAILED);
        return result;
    }

    public async updateComment(memberId: ObjectId, input: CommentUpdate): Promise<Comment> {
        const { _id } = input;

        const result = await this.commentModel
            .findOneAndUpdate({
                _id: _id, memberId: memberId, commentStatus: CommentStatus.ACTIVE,
            }, 
            input, 
            { new: true })
            .exec();
        
        if(!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
        return result;
    }

    public async getComments(memberId: ObjectId, input: CommentsInquiry): Promise<Comments> {
        const { commentRefId } = input.search;
        const match: T = { 
            commentRefId: commentRefId, 
            commentStatus: CommentStatus.ACTIVE,
            parentCommentId: null
        };
        const sort: T = { [input?.sort ?? "createdAt"]: input?.direction ?? Direction.DESC };
        const result = await this.commentModel.aggregate([
            { $match: match },
            { $sort: sort },
            {
                $facet: {
                    list: [
                        { $skip: (input.page - 1) * input.limit }, 
                        { $limit: input.limit },
                        {
                            $addFields: {
                                commentLikes: { $ifNull: ['$commentLikes', 0] },
                                commentReplies: { $ifNull: ['$commentReplies', 0] }
                            }
                        },
                        lookupMember,
                        { $unwind: "$memberData" },
                        
                        // Replies lookup
                        {
                            $lookup: {
                                from: 'comments',
                                let: { commentId: '$_id' },
                                pipeline: [
                                    {
                                        $match: {
                                            $expr: { 
                                                $and: [
                                                    { $eq: ['$parentCommentId', '$$commentId'] },
                                                    { $eq: ['$commentStatus', CommentStatus.ACTIVE] }
                                                ]
                                            }
                                        }
                                    },
                                    { $sort: { createdAt: 1 } },
                                    
                                    {
                                        $addFields: {
                                            commentLikes: { $ifNull: ['$commentLikes', 0] },
                                            commentReplies: { $ifNull: ['$commentReplies', 0] }
                                        }
                                    },
                                    
                                    {
                                        $lookup: {
                                            from: 'members',
                                            localField: 'memberId',
                                            foreignField: '_id',
                                            as: 'memberData'
                                        }
                                    },
                                    { $unwind: '$memberData' }
                                ],
                                as: 'replies'
                            }
                        }
                    ],
                    metaCounter: [{ $count: "total" }],
                },
            },
        ]).exec();
        
        if(!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        return result[0];
    }

    public async likeTargetComment(memberId: ObjectId, likeRefId: ObjectId): Promise<Comment> {
        const targetComment = await this.commentModel
             .findOne({ _id: likeRefId, commentStatus: CommentStatus.ACTIVE })
             .exec();
        if(!targetComment) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        const input: LikeInput = {
            memberId: memberId,
            likeRefId: likeRefId,
            likeGroup: LikeGroup.COMMENT
        };

        const modifier: number = await this.likeService.toggleLike(input);
        const result = await this.commentStatsEditor({ _id: likeRefId, targetKey: "commentLikes", modifier: modifier });

        if(!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);

        return result;
    }

    public async removeCommentByAdmin(input: ObjectId): Promise<Comment> {
        const result = await this.commentModel.findByIdAndDelete(input);
        if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
        return result;
    }

    public async commentStatsEditor(input: StatisticModifier): Promise<Comment> {
        const { _id, targetKey, modifier } = input;
		const result = await this.commentModel
			.findByIdAndUpdate(
				_id, 
				{
					$inc: { [targetKey]: modifier }, 
				}, 
				{ new: true }
			)
			.exec();
		if (!result) {
			throw new InternalServerErrorException(Message.UPDATE_FAILED);
		}

		return result;
    }
}
