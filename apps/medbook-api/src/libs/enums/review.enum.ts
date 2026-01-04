import { registerEnumType } from '@nestjs/graphql';

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

registerEnumType(ReviewStatus, {
  name: 'ReviewStatus',
  description: 'Status of review',
});