import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Follower, Followers, Followings } from '../../libs/dto/follow/follow';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { FollowInquiry } from '../../libs/dto/follow/follow.input';

@Resolver()
export class FollowResolver {
	constructor(private readonly followService: FollowService) {}

	@UseGuards(AuthGuard)
	@Mutation((returns) => Follower)
	public async subscribeMember(@Args('input') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Follower> {
		console.log('Mutation: subscribeMember');
		const followingid = shapeIntoMongoObjectId(input);
		return await this.followService.subscribeMember(memberId, followingid);
	}

	@UseGuards(AuthGuard)
	@Mutation((returns) => Follower)
	public async unsubscribeMember(
		@Args('input') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Follower> {
		console.log('Mutation: unsubscribeMember');
		const followingid = shapeIntoMongoObjectId(input);
		return await this.followService.unsubscribeMember(memberId, followingid);
	}

	@UseGuards(AuthGuard)
	@Mutation((returns) => Follower)
	public async subscribeDoctor(@Args('input') input: string, @AuthMember('_id') memberId: ObjectId): Promise<Follower> {
		console.log('Mutation: subscribeDoctor');
		const doctorId = shapeIntoMongoObjectId(input);
		return await this.followService.subscribeDoctor(memberId, doctorId);
	}

	@UseGuards(AuthGuard)
	@Mutation((returns) => Follower)
	public async unsubscribeDoctor(
		@Args('input') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Follower> {
		console.log('Mutation: unsubscribeDoctor');
		const doctorId = shapeIntoMongoObjectId(input);
		return await this.followService.unsubscribeDoctor(memberId, doctorId);
	}

    @UseGuards(WithoutGuard)
    @Query((returns) => Followings)
    public async getMemberFollowings(
        @Args('input') input: FollowInquiry,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Followings> {
        console.log("Query: getMemberFollowings");
        const {followerId} = input.search;
        input.search.followerId = shapeIntoMongoObjectId(followerId);
        return await this.followService.getMemberFollowings(memberId, input);
    }

	@UseGuards(WithoutGuard)
	@Query((returns) => Followers)
	public async getMemberFollowers(
		@Args('input') input: FollowInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Followers> {
		console.log("Query: getMemberFollowers");
		const { followingId } = input.search;
		input.search.followingId = shapeIntoMongoObjectId(followingId);
		return await this.followService.getMemberFollowers(memberId, input);
	}
}
