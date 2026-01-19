import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	MEMBER = 'MEMBER',
	DOCTOR = 'DOCTOR',
	ARTICLE = 'ARTICLE',
	COMMENT = 'COMMENT',
}
registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
