import { Schema } from 'mongoose';
import { MemberStatus, MemberType} from '../libs/enums/member.enum';
import { Gender } from '../libs/enums/gender.enum';

const MemberSchema = new Schema(
  {
    memberNick: {
      type: String,
      index: { unique:true, sparse: true },
      required: true,
    },

    memberStatus: {
      type: String,
      enum: MemberStatus,
      default: MemberStatus.ACTIVE,
    },

    memberPassword: {
      type: String,
      required: true,
      select: false,
    },

    memberType: {
      type: String,
      enum: MemberType,
      default: MemberType.PATIENT,
    },

    memberPhone: {
      type: String,
      index: { unique:true, sparse: true },
      required: true,
    },

    memberImage: {
      type: String,
      default: '',
    },

    memberGender: {
      type: String,
      enum: Gender,
    },

    memberAddress: {
      street: String,
      city: String,
      state: String,
      country: String,
      zipCode: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    lastLogin: {
      type: Date,
    },

    // Patient-specific fields
    bloodGroup: {
      type: String,
    },

    allergies: {
      type: [String],
      default: [],
    },

    chronicDiseases: {
      type: [String],
      default: [],
    },

    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },

    // Doctor reference
    doctorProfile: {
      type: Schema.Types.ObjectId,
      ref: 'DoctorProfileSchema',
    },
  },
  {
    timestamps: true,
    collection: 'members',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default MemberSchema;