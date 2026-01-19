import { registerEnumType } from '@nestjs/graphql';

export enum RecordType {
	LAB_REPORT = 'LAB_REPORT',
	XRAY = 'XRAY',
	MRI = 'MRI',
	CT_SCAN = 'CT_SCAN',
	ULTRASOUND = 'ULTRASOUND',
	PRESCRIPTION = 'PRESCRIPTION',
	DISCHARGE_SUMMARY = 'DISCHARGE_SUMMARY',
	OTHER = 'OTHER',
}

registerEnumType(RecordType, {
	name: 'RecordType',
	description: 'Type of medical record',
});
