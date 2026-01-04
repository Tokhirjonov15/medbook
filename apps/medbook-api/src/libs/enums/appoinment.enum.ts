import { registerEnumType } from '@nestjs/graphql';

export enum AppointmentStatus {
  SCHEDULED = 'SCHEDULED',
  CONFIRMED = 'CONFIRMED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

registerEnumType(AppointmentStatus, {
  name: 'AppointmentStatus',
  description: 'Status of an appointment',
});