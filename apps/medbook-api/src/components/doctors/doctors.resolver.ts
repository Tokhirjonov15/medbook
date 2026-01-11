import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DoctorsService } from './doctors.service';
import { Doctor, Doctors } from '../../libs/dto/doctors/doctor';
import { DoctorSignupInput } from '../../libs/dto/doctors/doctor.input';
import { DoctorsInquiry, LoginInput } from '../../libs/dto/members/member.input';
import { Roles } from '../auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { MemberType } from '../../libs/enums/member.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { DoctorUpdate } from '../../libs/dto/doctors/doctor.update';
import { AuthGuard } from '../auth/guards/auth.guard';
import type { ObjectId } from 'mongoose';
import { AuthMember } from '../auth/decorators/authMember.decorator';

@Resolver()
export class DoctorsResolver {
	constructor(private readonly doctorsService: DoctorsService) {}

	@Mutation(() => Doctor)
	public async doctorSignup(@Args('input') input: DoctorSignupInput): Promise<Doctor> {
		console.log('Mutation: doctorSignup');
		return await this.doctorsService.doctorSignup(input);
	}

	@Mutation(() => Doctor)
	public async DoctorLogin(@Args('input') input: LoginInput): Promise<Doctor> {
		console.log('Mutation: login');
		return await this.doctorsService.DoctorLogin(input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Doctor)
	public async updateDoctor(
		@Args('input') input: DoctorUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Doctor> {
		console.log('Mutation: updateMember');
		delete input._id;
		return await this.doctorsService.updateDoctor(memberId, input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Doctors)
	public async getAllDoctorsByAdmin(
		@Args('input') input: DoctorsInquiry
	): Promise<Doctors> {
		console.log("Query: getAllDoctorsByAdmin");
		return await this.doctorsService.getAllDoctorsByAdmin(input);
    }

	@Roles(MemberType.ADMIN)
    @UseGuards(RolesGuard)
    @Mutation(() => Doctor)
    public async updateDoctorByAdmin(
        @Args('input') input: DoctorUpdate
    ): Promise<Doctor> {
        console.log("Mutation: updateDoctorByAdmin");
        return await this.doctorsService.updateDoctorByAdmin(input);
    }
}
