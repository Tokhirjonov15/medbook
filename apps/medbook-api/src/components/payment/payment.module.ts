import { Module } from '@nestjs/common';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import PaymentSchema from '../../schemas/Payment.model';
import AppointmentSchema from '../../schemas/Appoinment.model';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: 'Payment', schema: PaymentSchema },
			{ name: 'Appointment', schema: AppointmentSchema },
		]),
		AuthModule,
	],
	providers: [PaymentService, PaymentResolver],
	exports: [PaymentService],
})
export class PaymentModule {}
