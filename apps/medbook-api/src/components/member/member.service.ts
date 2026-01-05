import { BadRequestException, Injectable } from '@nestjs/common';
import { SignupInput } from '../../libs/dto/members/member.input';
import { Member } from '../../libs/dto/members/member';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MemberService {
    constructor(@InjectModel("Member") private readonly memberModel: Model<Member>) {}

    public async signup(input: SignupInput): Promise<Member> {
        // TODO: Hash Password
        try {
            const result = await this.memberModel.create(input);
            // TODO:  Authentication via TOKEN
            return result;
        } catch (err) {
            console.log("ERROR, service.model:", err);
            throw new BadRequestException(err);
        }
    }

    public async login(): Promise<string> {
        return "login executed";
    }

    public async updateMember(): Promise<string> {
        return "updateMember executed";
    }

    public async getMember(): Promise<string> {
        return "getMember executed";
    }
}
