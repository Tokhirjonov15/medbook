import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { DoctorsService } from './doctors.service';
import { Doctor } from '../../libs/dto/doctors/doctor';
import { DoctorSignupInput } from '../../libs/dto/doctors/doctor.input';

@Resolver()
export class DoctorsResolver {
	constructor(private readonly doctorsService: DoctorsService) {}

	@Mutation(() => Doctor)
	public async doctorSignup(@Args('input') input: DoctorSignupInput): Promise<Doctor> {
		console.log('Mutation: doctorSignup');
		return this.doctorsService.doctorSignup(input);
	}
}
