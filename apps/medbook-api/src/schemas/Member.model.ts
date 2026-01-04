import { Schema } from 'mongoose';
import { UserRole } from '../libs/enums/member.enum';
import { Gender } from '../libs/enums/gender.enum';

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: UserRole,
      default: UserRole.PATIENT,
      index: true,
    },

    phone: {
      type: String,
    },

    avatar: {
      type: String,
      default: '',
    },

    dateOfBirth: {
      type: Date,
    },

    gender: {
      type: String,
      enum: Gender,
    },

    address: {
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

    emailVerified: {
      type: Boolean,
      default: false,
    },

    verificationToken: {
      type: String,
      select: false,
    },

    passwordResetToken: {
      type: String,
      select: false,
    },

    passwordResetExpires: {
      type: Date,
      select: false,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    lastLogin: {
      type: Date,
    },

    refreshToken: {
      type: String,
      select: false,
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
      ref: 'DoctorProfile',
    },
  },
  {
    timestamps: true,
    collection: 'members',
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ createdAt: -1 });

// Virtual field
UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export default UserSchema;