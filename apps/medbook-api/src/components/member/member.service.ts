import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DoctorsInquiry, LoginInput, SignupInput } from '../../libs/dto/members/member.input';
import { Member, Members } from '../../libs/dto/members/member';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberStatus, MemberType } from '../../libs/enums/member.enum';
import { Direction, Message } from '../../libs/enums/common.enum';
import { AuthService } from '../auth/auth.service';
import { MemberUpdate } from '../../libs/dto/members/member.update';
import { T } from '../../libs/types/common';

@Injectable()
export class MemberService {
    constructor(
        @InjectModel("Member") private readonly memberModel: Model<Member>,
        private authService: AuthService
    ) {}

    public async signup(input: SignupInput): Promise<Member> {
        input.memberPassword = await this.authService.hashPassword(input.memberPassword);
        try {
            const result = await this.memberModel.create(input);
             result.accessToken = await this.authService.createToken(result);
            
            return result;
        } catch (err) {
            console.log("ERROR, service.model:", err.message);
            throw new BadRequestException(Message.USED_MEMBER_NICK_OR_PHONE);
        }
    }

    public async login(input: LoginInput): Promise<Member> {
        const { memberNick, memberPassword } = input;
        const response: Member | null = await this.memberModel
          .findOne({ memberNick: memberNick })
          .select('+memberPassword')
          .exec();

        if (!response || response.memberStatus === MemberStatus.DELETE) {
			throw new InternalServerErrorException(Message.NO_MEMBER_NICK);
		} else if (response.memberStatus === MemberStatus.BLOCK) {
			throw new InternalServerErrorException(Message.BLOCKED_USER);
		}
        if(!response.memberPassword) {
            throw new InternalServerErrorException(Message.WRONG_PASSWORD);
        }

        const isMatch = await this.authService.comparePassword(input.memberPassword, response.memberPassword);
        if(!isMatch) throw new InternalServerErrorException(Message.WRONG_PASSWORD);
        response.accessToken = await this.authService.createToken(response);

        return response;
    }

    public async updateMember(
        memberId: ObjectId,
        input: MemberUpdate,
    ): Promise<Member> {
        const result = await this.memberModel.findOneAndUpdate(
            {
                _id: memberId,
                memberStatus: MemberStatus.ACTIVE,
            },
            input,
            { new: true },
        )
        .exec();
        if(!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

        result.accessToken = await this.authService.createToken(result);
        return result;
    }

    public async getMember(targetId: ObjectId): Promise<Member> {
        const search: T = {
            _id: targetId,
            memberStatus: {
                $in: [MemberStatus.ACTIVE, MemberStatus.BLOCK],
            },
        };
        const targetMember = await this.memberModel.findOne(search).exec();
        if(!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

        return targetMember;
    }

    public async getDoctors(memberId: ObjectId, input: DoctorsInquiry): Promise<Members> {
        const { text } = input.search;
        const match: T = {memberType: MemberType.DOCTOR, memberStatus: MemberStatus.ACTIVE};
        const sort: T = {[input?.sort ?? "createdAt"] : input?.direction ?? Direction.DESC};

        if (text) match.memberNick = {$regex: new RegExp(text, "i")};
        console.log("match:", match);

        const result = await this.memberModel.aggregate([
			{$match: match},
			{$sort: sort},
			{
				$facet: {
					list: [{$skip: (input.page - 1) * input.limit }, { $limit: input.limit }],
					metaCounter: [{$count: "total"}],
				},
			},
		])
		.exec();
        console.log("result:", result);
        if(!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
        
        return result[0];
    }

    public async getAllmembersByAdmin(): Promise<string> {
        return "getAllmembersByAdmin executed";
    }

    public async updateMemberByAdmin(): Promise<string> {
        return "updateMemberByAdmin executed";
    }
}
