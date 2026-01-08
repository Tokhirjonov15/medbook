import { Schema } from 'mongoose';
import { Specialization } from '../libs/enums/specialization.enum';
import { ConsultationType } from '../libs/enums/consultation.enum';
import { DayOfWeek } from '../libs/enums/day-of-week.enum';
import { VerificationStatus } from '../libs/enums/verification.enum';

const DoctorProfileSchema = new Schema(
  {
    member: {
      type: Schema.Types.ObjectId,
      ref: 'Member',
      required: true,
      unique: true,
      index: true,
    },

    licenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    specializations: {
      type: [String],
      enum: Specialization,
      required: true,
      index: true,
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
      required: true,
    },

    about: {
      type: String,
      required: true,
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
      required: true,
    },

    consultationDuration: {
      type: Number,
      default: 30,
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

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      index: true,
    },

    reviewCount: {
      type: Number,
      default: 0,
    },

    totalPatients: {
      type: Number,
      default: 0,
    },

    totalConsultations: {
      type: Number,
      default: 0,
    },

    verificationStatus: {
      type: String,
      enum: VerificationStatus,
      default: VerificationStatus.PENDING,
      index: true,
    },

    verificationDocuments: [
      {
        documentType: String,
        url: String,
        uploadedAt: Date,
      },
    ],

    rejectionReason: {
      type: String,
    },

    awards: {
      type: [String],
      default: [],
    },

    services: {
      type: [String],
      default: [],
    },

    bankDetails: {
      accountName: String,
      accountNumber: String,
      bankName: String,
      ifscCode: String,
    },

    isAcceptingPatients: {
      type: Boolean,
      default: true,
      index: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    collection: 'doctor',
  }
);

// Compound indexes for search
DoctorProfileSchema.index({
  specializations: 1,
  'clinicDetails.address.city': 1,
  rating: -1,
});

export default DoctorProfileSchema;