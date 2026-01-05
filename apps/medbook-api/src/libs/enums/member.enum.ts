import { registerEnumType } from '@nestjs/graphql';

export enum MemberType {
  PATIENT = 'PATIENT',
  DOCTOR = 'DOCTOR',
  ADMIN = 'ADMIN',
}

registerEnumType(MemberType, {
  name: 'MemberType',
  description: 'User role in the system',
});