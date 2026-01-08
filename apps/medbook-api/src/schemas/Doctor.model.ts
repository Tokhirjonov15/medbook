import { Schema } from 'mongoose';
import { Specialization } from '../libs/enums/specialization.enum';
import { ConsultationType } from '../libs/enums/consultation.enum';
import { DayOfWeek } from '../libs/enums/day-of-week.enum';
import { MemberType } from '../libs/enums/member.enum';
import { Gender } from '../libs/enums/gender.enum';

const DoctorProfileSchema = new Schema(
  {
    memberType: {
        type: String,
        enum: MemberType,
        default: MemberType.DOCTOR,
    },

    memberGender: {
      type: String,
      enum: Gender,
    },

    memberNick: {
      type: String,
      ref: 'Member',
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

    memberImage: {
        type: String,
        default: '',
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

    qualifications: [
      {
        degree: String,
        institution: String,
        year: Number,
      },
    ],

    experience: {
      type: Number,
    },

    languages: {
      type: [String],
      default: [],
    },

    clinicDetails: {
      name: String,
      address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        coordinates: {
          lat: Number,
          lng: Number,
        },
      },
      phone: String,
    },

    consultationFee: {
      type: Number,
    },

    consultationType: {
      type: String,
      enum: ConsultationType,
      default: ConsultationType.BOTH,
    },

    availability: [
      {
        day: {
          type: String,
          enum: DayOfWeek,
        },
        isAvailable: {
          type: Boolean,
          default: true,
        },
        slots: [
          {
            startTime: String,
            endTime: String,
            breakTime: {
              start: String,
              end: String,
            },
          },
        ],
      },
    ],

    DoctorViews: {
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

    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      ifscCode: String,
    },
  },
  {
    timestamps: true,
    collection: 'doctor',
  }
);

export default DoctorProfileSchema;