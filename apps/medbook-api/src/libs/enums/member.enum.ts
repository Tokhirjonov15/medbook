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

export enum MemberStatus {
    ACTIVE = "ACTIVE",
    DELETE = "DELETE",
    BLOCK = "BLOCK",
}
registerEnumType(MemberStatus, {
    name: 'MemberStatus'
});

export enum MemberAuthType {
    PHONE = "PHONE",
    EMAIL = "EMAIL",
    TELEGRAM = "TELEGRAM",
}
registerEnumType(MemberAuthType, {
    name: 'MemberAuthType'
});