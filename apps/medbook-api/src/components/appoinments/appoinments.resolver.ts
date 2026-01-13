import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AppoinmentsService } from './appoinments.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { Appointment } from '../../libs/dto/appoinment/appoinment';
import { BookAppointmentInput } from '../../libs/dto/appoinment/appoinment.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';

@Resolver()
export class AppoinmentsResolver {
    constructor(private readonly appoinmentService: AppoinmentsService) {}

    @Roles(MemberType.PATIENT)
    @UseGuards(RolesGuard)
    @Mutation(() => Appointment)
    public async bookAppoinment(
        @Args('input') input: BookAppointmentInput,
        @AuthMember('_id') memberId: ObjectId,
    ): Promise<Appointment> {
        console.log("Mutation: bookAppoinment");
        return await this.appoinmentService.bookAppointment(memberId, input);
    }
}
