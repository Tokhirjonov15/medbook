import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AppoinmentsService } from './appoinments.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { Appointment, Appointments } from '../../libs/dto/appoinment/appoinment';
import {
	AllAppointmentsInquiry,
	AppointmentsInquiry,
	BookAppointmentInput,
} from '../../libs/dto/appoinment/appoinment.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { AppointmentUpdate } from '../../libs/dto/appoinment/appoinment.update';

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
		console.log('Mutation: bookAppoinment');
		return await this.appoinmentService.bookAppointment(memberId, input);
	}

	@Roles(MemberType.PATIENT)
	@UseGuards(RolesGuard)
	@Query(() => Appointments)
	public async getMyAppointments(
		@Args('input') input: AppointmentsInquiry,
		@AuthMember('_id') memberId: string,
	): Promise<Appointments> {
		console.log('Query: getMyAppoinments');
		return await this.appoinmentService.getMyAppointments(memberId, input);
	}

	@Roles(MemberType.PATIENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Appointment)
	public async updateAppointment(
		@Args('input') input: AppointmentUpdate,
		@AuthMember('_id') memberId: string,
	): Promise<Appointment> {
		console.log('Mutation: updateAppointment');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.appoinmentService.updateAppointment(shapeIntoMongoObjectId(memberId), input);
	}

	@Roles(MemberType.DOCTOR, MemberType.PATIENT)
	@UseGuards(RolesGuard)
	@Query(() => Appointments)
	public async getDoctorAppointments(
		@Args('input') input: AppointmentsInquiry,
		@AuthMember('_id') memberId: string,
		@AuthMember('memberType') memberType: MemberType,
	): Promise<Appointments> {
		console.log('Query: getDoctorAppointments');
		return await this.appoinmentService.getDoctorAppointments(memberId, memberType, input);
	}

	@Roles(MemberType.PATIENT)
	@UseGuards(RolesGuard)
	@Mutation(() => Appointment)
	public async cancelAppointment(
		@Args('appionmentId') appointmentId: string,
		@Args('reason') reason: string,
		@AuthMember('_id') memberId: string,
	): Promise<Appointment> {
		console.log('Mutation: cancelAppointments');
		const id = shapeIntoMongoObjectId(appointmentId);
		return await this.appoinmentService.cancelAppointment(memberId, id, reason);
	}

	/** ADMIN */

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query((returns) => Appointments)
	public async getAllAppointmentByAdmin(
		@Args('input') input: AllAppointmentsInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Appointments> {
		console.log('Query: getAllAppointmentByAdmin');
		return await this.appoinmentService.getAllAppointmentByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Appointment)
	public async updateAppointmentByAdmin(
		@Args('input') input: AppointmentUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Appointment> {
		console.log('Mutation: updateAppointmentByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.appoinmentService.updateAppointmentByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation((returns) => Appointment)
	public async removeAppointmentByAdmin(
		@Args('appointmentId') input: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Appointment> {
		console.log('Mutation: removeAppointmentByAdmin');
		const appointmentId = shapeIntoMongoObjectId(input);
		return await this.appoinmentService.removeAppointmentByAdmin(appointmentId);
	}
}
