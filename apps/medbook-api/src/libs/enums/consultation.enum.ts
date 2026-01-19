import { registerEnumType } from '@nestjs/graphql';

export enum ConsultationType {
	VIDEO = 'VIDEO',
	CLINIC = 'CLINIC',
	BOTH = 'BOTH',
}

registerEnumType(ConsultationType, {
	name: 'ConsultationType',
	description: 'Type of consultation offered',
});
