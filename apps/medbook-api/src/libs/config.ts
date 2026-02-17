import { ObjectId } from 'bson';

export const availableDoctorSorts = ['createdAt', 'updatedAt', 'rating', 'doctorViews'];
export const availableMemberSorts = ['createdAt', 'updatedAt'];
export const availableAppointmentSorts = ['createdAt', 'updatedAt'];
export const availableBoardArticleSorts = ['createdAt', 'updatedAt', 'articleLikes', 'articleViews'];
export const availableCommentSorts = ['createdAt', 'updatedAt'];
export const availableNoticeSorts = ['createdAt', 'updatedAt'];

/** IMAGE CONFIGURATION */
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { T } from './types/common';

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
	const ext = path.parse(filename).ext;
	return uuidv4() + ext;
};

export const shapeIntoMongoObjectId = (target: any) => {
	return typeof target === 'string' ? new ObjectId(target) : target;
};

export const lookupAuthMemberLiked = (memberId: T, targetRefId: string = '$_id') => {
    if (!memberId) {
        return {
            $addFields: {
                meLiked: null
            }
        };
    }
    
    const memberIdObj = memberId instanceof ObjectId 
        ? memberId 
        : new ObjectId(memberId.toString());

    return {
        $lookup: {
            from: 'likes',
            let: {
                localLikeRefId: targetRefId,
                localMemberId: memberIdObj,
                localMyFavorite: true,
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ['$likeRefId', '$$localLikeRefId'] }, 
                                { $eq: ['$memberId', '$$localMemberId'] }
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        memberId: 1,
                        likeRefId: 1,
                        myFavorite: '$$localMyFavorite',
                    },
                },
            ],
            as: 'meLiked',
        },
    };
};

interface LookupAuthMemberFollowed {
    followerId: T;
    followingId: string;
}

export const lookupAuthMemberFollowed = (input: LookupAuthMemberFollowed) => {
    const { followerId, followingId } = input;
    
    if (!followerId) {
        return {
            $addFields: {
                meFollowed: null
            }
        };
    }

    const followerIdObj = followerId instanceof ObjectId 
        ? followerId 
        : new ObjectId(followerId.toString());

    return {
        $lookup: {
            from: "follows",
            let: {
                localFollowerId: followerIdObj,
                localFollowingId: followingId,
                localMyFavorite: true
            },
            pipeline: [
                {
                    $match: {
                        $expr: {
                            $and: [
                                { $eq: ["$followerId", "$$localFollowerId"] }, 
                                { $eq: ["$followingId", "$$localFollowingId"] }
                            ],
                        },
                    },
                },
                {
                    $project: {
                        _id: 0,
                        followerId: 1,
                        followingId: 1,
                        myFollowing: '$$localMyFavorite',
                    },
                },
            ],
            as: "meFollowed",
        },
    };
};

export const lookupMember = {
	$lookup: {
		from: 'members',
		localField: 'memberId',
		foreignField: '_id',
		as: 'memberData',
	},
};
export const lookupAppointment = {
	$lookup: {
		from: 'appointments',
		localField: 'appointment',
		foreignField: '_id',
		as: 'appointmentData',
	},
};
export const lookupPatient = {
	$lookup: {
		from: 'members',
		localField: 'patient',
		foreignField: '_id',
		as: 'patientData',
	},
};
export const lookupDoctor = {
	$lookup: {
		from: 'doctor',
		localField: 'doctor',
		foreignField: '_id',
		as: 'doctorData',
	},
};
export const lookupRefunded = {
	$lookup: {
		from: 'members',
		localField: 'refundedBy',
		foreignField: '_id',
		as: 'refundedByData',
	},
};
export const lookupFollowingDataMember = {
	$lookup: {
		from: 'members',
		localField: 'followingId',
		foreignField: '_id',
		as: 'followingData',
	},
};
export const lookupFollowingDataDoctor = {
	$lookup: {
		from: 'doctors',
		localField: 'followingId',
		foreignField: '_id',
		as: 'doctorData',
	},
};
export const lookupFollowerData = {
	$lookup: {
		from: 'members',
		localField: 'followerId',
		foreignField: '_id',
		as: 'followerData',
	},
};

export const lookupDoctorVisit = {
    $lookup: {
        from: 'members',
        localField: 'visitedDoctor.memberId',
        foreignField: '_id',
        as: 'visitedDoctor.memberData',
    },
};
