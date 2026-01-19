import { Schema } from 'mongoose';
import { Specialization } from '../libs/enums/specialization.enum';
import { ConsultationType } from '../libs/enums/consultation.enum';
import { DayOfWeek } from '../libs/enums/day-of-week.enum';
import { MemberStatus, MemberType } from '../libs/enums/member.enum';
import { Gender } from '../libs/enums/gender.enum';

const DoctorProfileSchema = new Schema(
	{
		memberType: {
			type: String,
			enum: MemberType,
			default: MemberType.DOCTOR,
		},

		memberStatus: {
			type: String,
			enum: MemberStatus,
			default: MemberStatus.ACTIVE,
		},

		memberGender: {
			type: String,
			enum: Gender,
		},

		memberNick: {
			type: String,
			ref: 'members',
			required: true,
		},

		memberPhone: {
			type: String,
			required: true,
			unique: true,
		},

		memberPassword: {
			type: String,
			select: false,
			required: true,
		},

		memberFullName: {
			type: String,
		},

		memberDesc: {
			type: String,
			default: '',
		},

		memberImage: {
			type: String,
			default: '',
		},

		totalPatients: {
			type: Number,
			default: 0,
		},

		memberArticles: {
			type: Number,
			default: 0,
		},

		memberFollowers: {
			type: Number,
			default: 0,
		},

		memberFollowings: {
			type: Number,
			default: 0,
		},

		memberLikes: {
			type: Number,
			default: 0,
		},

		memberComments: {
			type: Number,
			default: 0,
		},

		memberWarnings: {
			type: Number,
			default: 0,
		},

		memberBlocks: {
			type: Number,
			default: 0,
		},

		licenseNumber: {
			type: String,
			required: true,
			unique: true,
		},

		specialization: {
			type: String,
			enum: Specialization,
			required: true,
		},

		experience: {
			type: Number,
		},

		languages: {
			type: [String],
			default: [],
		},

		clinicAddress: {
			type: String,
		},

		clinicName: {
			type: String,
		},

		consultationFee: {
			type: Number,
		},

		consultationType: {
			type: String,
			enum: ConsultationType,
			default: ConsultationType.BOTH,
		},

		workingDays: {
			type: [String],
			enum: DayOfWeek,
		},

		workingHours: {
			type: [String],
		},

		breakTime: {
			type: [String],
		},

		doctorViews: {
			type: Number,
			default: 0,
		},

		reviewCount: {
			type: Number,
			default: 0,
		},

		awards: {
			type: [String],
			default: [],
		},
	},
	{
		timestamps: true,
		collection: 'doctor',
	},
);

export default DoctorProfileSchema;
