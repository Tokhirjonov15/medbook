import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { InternalServerErrorException, UsePipes, ValidationPipe } from '@nestjs/common';
import { SignupInput } from '../../libs/dto/members/member.input';
import { Member } from '../../libs/dto/members/member';

@Resolver()
export class MemberResolver {
    constructor(private readonly memberService: MemberService) {}

    @Mutation(() => Member)
    @UsePipes(ValidationPipe)
    public async signup(@Args("input") input: SignupInput): Promise<Member> {
        try {
            console.log("Mutation: signup");
            console.log("input:", input);
            return this.memberService.signup(input);
        } catch (err) {
            console.log("ERROR, signup:", err);
            throw new InternalServerErrorException(err);
        }
    }

    @Mutation(() => String)
    public async login(): Promise<string> {
        console.log("Mutation: login");
        return this.memberService.login();
    }

    @Mutation(() => String)
    public async updateMember(): Promise<string> {
        console.log("Mutation: updateMember");
        return this.memberService.updateMember();
    }

    @Query(() => String)
    public async getMember(): Promise<string> {
        console.log("Query: getMember");
        return this.memberService.getMember();
    }
}
