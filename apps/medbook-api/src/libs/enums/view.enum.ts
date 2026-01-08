import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	DOCTOR = "DOCTOR",
}
registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
