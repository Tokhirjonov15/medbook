import { Schema } from 'mongoose';

const TimeSlotSchema = new Schema(
	{
		doctor: {
			type: Schema.Types.ObjectId,
			ref: 'User',
			required: true,
			index: true,
		},

		date: {
			type: Date,
			required: true,
			index: true,
		},

		slots: [
			{
				start: String,
				end: String,
				isBooked: {
					type: Boolean,
					default: false,
				},
				appointment: {
					type: Schema.Types.ObjectId,
					ref: 'Appointment',
				},
			},
		],
	},
	{
		timestamps: true,
		collection: 'time',
	},
);

// Compound unique index
TimeSlotSchema.index({ doctor: 1, date: 1 }, { unique: true });

export default TimeSlotSchema;
