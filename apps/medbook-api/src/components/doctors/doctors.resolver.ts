import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { DoctorsService } from './doctors.service';
import { Doctor } from '../../libs/dto/doctors/doctor';
import { DoctorSignupInput } from '../../libs/dto/doctors/doctor.input';
import { LoginInput } from '../../libs/dto/members/member.input';

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
}
