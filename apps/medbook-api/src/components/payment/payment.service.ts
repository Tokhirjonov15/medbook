import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment } from '../../libs/dto/payment/payment';
import { Model } from 'mongoose';
import { Appointment } from '../../libs/dto/appoinment/appoinment';

@Injectable()
export class PaymentService {
    constructor(
        @InjectModel('Payment') private readonly paymentModel: Model<Payment>,
        @InjectModel('Appointment') private readonly appointmentModel: Model<Appointment>,
    ) {}
}
