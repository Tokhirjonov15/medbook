import { Schema } from 'mongoose';
import { ConsultationType } from '../libs/enums/consultation.enum';
import { AppointmentStatus } from '../libs/enums/appoinment.enum';
import { PaymentStatus } from '../libs/enums/payment.enum';

const AppointmentSchema = new Schema(
	{
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

		appointmentDate: {
			type: Date,
			required: true,
			index: true,
		},

		timeSlot: {
			start: String,
			end: String,
		},

		consultationType: {
			type: String,
			enum: ConsultationType,
			required: true,
		},

		status: {
			type: String,
			enum: AppointmentStatus,
			default: AppointmentStatus.SCHEDULED,
			index: true,
		},

		reason: {
			type: String,
			required: true,
		},

		symptoms: {
			type: [String],
			default: [],
		},

		notes: {
			type: String,
		},

		consultationFee: {
			type: Number,
			required: true,
		},

		paymentStatus: {
			type: String,
			enum: PaymentStatus,
			default: PaymentStatus.PENDING,
			index: true,
		},

		paidAt: {
			type: Date,
		},

		meetingLink: {
			type: String,
		},

		meetingId: {
			type: String,
		},

		meetingPassword: {
			type: String,
		},

		prescription: {
			type: Schema.Types.ObjectId,
			ref: 'Prescription',
		},

		followUpDate: {
			type: Date,
		},

		followUpAppointment: {
			type: Schema.Types.ObjectId,
			ref: 'Appointment',
		},

		cancelledBy: {
			type: Schema.Types.ObjectId,
			ref: 'User',
		},

		cancellationReason: {
			type: String,
		},

		cancelledAt: {
			type: Date,
		},

		reminderSent: {
			type: Boolean,
			default: false,
		},

		completedAt: {
			type: Date,
		},

		duration: {
			type: Number,
		},
	},
	{
		timestamps: true,
		collection: 'appointments',
	},
);

// Indexes
AppointmentSchema.index({ patient: 1, appointmentDate: -1 });
AppointmentSchema.index({ doctor: 1, appointmentDate: -1 });
AppointmentSchema.index({ status: 1 });
AppointmentSchema.index({ paymentStatus: 1 });
AppointmentSchema.index({ appointmentDate: 1 });

// Compound indexes
AppointmentSchema.index({
	doctor: 1,
	appointmentDate: 1,
	status: 1,
});

export default AppointmentSchema;
