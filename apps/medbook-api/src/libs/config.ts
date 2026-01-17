import { ObjectId } from "bson";

export const availableDoctorSorts = ["createdAt", "updatedAt", "rating", "doctorViews"];
export const availableMemberSorts = ["createdAt", "updatedAt"];
export const availableAppointmentSorts = ["createdAt", "updatedAt"];
export const availableBoardArticleSorts = ["createdAt", "updatedAt", "articleLikes", "articleViews"];
export const availableCommentSorts = ["createdAt", "updatedAt"];

/** IMAGE CONFIGURATION */
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';

export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const getSerialForImage = (filename: string) => {
	const ext = path.parse(filename).ext;
	return uuidv4() + ext;
};

export const shapeIntoMongoObjectId = (target: any) => {
    return typeof target === 'string' ? new ObjectId(target) : target;
};

export const lookupMember = {
	$lookup: {
		from: "members",
		localField: "memberId",
		foreignField: "_id",
		as: "memberData",
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
