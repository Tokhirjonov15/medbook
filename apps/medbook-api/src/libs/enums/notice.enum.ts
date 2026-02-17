import { registerEnumType } from '@nestjs/graphql';

export enum NoticeStatus {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
	DELETED = 'DELETED',
}
registerEnumType(NoticeStatus, {
	name: 'NoticeStatus',
	description: 'Status of Notices written by Admin',
});

export enum NoticeTarget {
	ALL = 'ALL',
	PATIENT = 'PATIENT',
	DOCTOR = 'DOCTOR',
}
registerEnumType(NoticeTarget, {
	name: 'NoticeTarget',
});
