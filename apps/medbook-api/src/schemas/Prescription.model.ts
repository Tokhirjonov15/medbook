import { Schema } from 'mongoose';

const PrescriptionSchema = new Schema(
  {
    appointment: {
      type: Schema.Types.ObjectId,
      ref: 'Appointment',
      required: true,
      unique: true,
      index: true,
    },

    patient: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    doctor: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    diagnosis: {
      type: String,
      required: true,
    },

    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,
        duration: String,
        instructions: String,
        timing: String,
      },
    ],

    labTests: [
      {
        testName: String,
        instructions: String,
      },
    ],

    advice: {
      type: String,
    },

    nextVisit: {
      type: Date,
    },

    attachments: {
      type: [String],
      default: [],
    },

    vitals: {
      bloodPressure: String,
      temperature: Number,
      pulse: Number,
      weight: Number,
      height: Number,
      oxygenSaturation: Number,
    },

    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
    collection: 'prescriptions',
  }
);

// Indexes
PrescriptionSchema.index({ appointment: 1 });
PrescriptionSchema.index({ patient: 1, createdAt: -1 });
PrescriptionSchema.index({ doctor: 1, createdAt: -1 });

export default PrescriptionSchema;