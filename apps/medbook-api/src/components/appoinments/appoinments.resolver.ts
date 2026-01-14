import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppoinmentsService } from './appoinments.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { Appointment, Appointments } from '../../libs/dto/appoinment/appoinment';
import { AppointmentsInquiry, BookAppointmentInput } from '../../libs/dto/appoinment/appoinment.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class AppoinmentsResolver {
    constructor(private readonly appoinmentService: AppoinmentsService) {}

    @Roles(MemberType.PATIENT)
    @UseGuards(RolesGuard)
    @Mutation(() => Appointment)
    public async bookAppointment(
        @Args('input') input: BookAppointmentInput,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Appointment> {
        console.log("Mutation: bookAppoinment");
        return await this.appoinmentService.bookAppointment(memberId, input);
    }

    @Roles(MemberType.PATIENT)
    @UseGuards(RolesGuard)
    @Query(() => Appointments)
    public async getMyAppointments(
        @Args('input') input: AppointmentsInquiry,
        @AuthMember('_id') memberId: string,
    ): Promise<Appointments> {
        console.log("Query: getMyAppoinments");
        return await this.appoinmentService.getMyAppointments(memberId, input);
    }

    @Roles(MemberType.DOCTOR)
    @UseGuards(RolesGuard)
    @Query(() => Appointments)
    public async getDoctorAppointments(
        @Args('input') input: AppointmentsInquiry,
        @AuthMember('_id') memberId: string,
    ): Promise<Appointments> {
        console.log("Query: getDoctorAppointments");
        return await this.appoinmentService.getDoctorAppointments(memberId, input);
    }

    @Roles(MemberType.PATIENT)
    @UseGuards(RolesGuard)
    @Mutation(() => Appointment)
    public async cancelAppointment(
        @Args('appionmentId') appointmentId: string,
        @Args('reason') reason: string,
        @AuthMember('_id') memberId: string,
    ): Promise<Appointment> {
        console.log("Mutation: cancelAppointments");
        const id = shapeIntoMongoObjectId(appointmentId);
        return await this.appoinmentService.cancelAppointment(memberId, id, reason);
    }
}
