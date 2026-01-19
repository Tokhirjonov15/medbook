import { Schema } from 'mongoose';
import { RecordType } from '../libs/enums/record.enum';

const MedicalRecordSchema = new Schema(
	{
		patient: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},

		uploadedBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},

		title: {
			type: String,
			required: true,
		},

		description: {
			type: String,
		},

		type: {
			type: String,
			enum: RecordType,
			required: true,
			index: true,
		},

		fileUrl: {
			type: String,
			required: true,
		},

		fileSize: {
			type: Number,
		},

		recordDate: {
			type: Date,
			required: true,
			index: true,
		},

		appointment: {
			type: Schema.Types.ObjectId,
			ref: 'Appointment',
			index: true,
		},

		tags: {
			type: [String],
			default: [],
			index: true,
		},
	},
	{
		timestamps: true,
		collection: 'medical_records',
	},
);

// Indexes
MedicalRecordSchema.index({ patient: 1, recordDate: -1 });
MedicalRecordSchema.index({ type: 1 });
MedicalRecordSchema.index({ appointment: 1 });
MedicalRecordSchema.index({ tags: 1 });

export default MedicalRecordSchema;
