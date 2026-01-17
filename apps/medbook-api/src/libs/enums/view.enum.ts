import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	DOCTOR = "DOCTOR",
}
registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
