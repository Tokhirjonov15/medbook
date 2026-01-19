import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { Message } from '../../libs/enums/common.enum';
import { MessageResponse } from '../../libs/dto/auth/auth.response';
import { ForgotPasswordInput } from '../../libs/dto/auth/forgotPassword';
import { ResetPasswordInput } from '../../libs/dto/auth/resetPassword';

@Resolver()
export class AuthResolver {
	constructor(private readonly authService: AuthService) {}

	@Mutation(() => MessageResponse)
	public async forgotPassword(@Args('input') input: ForgotPasswordInput): Promise<MessageResponse> {
		console.log('Mutation: forgotPassword');
		console.log('Input:', input);

		const isValid = await this.authService.verifyMemberCredentials(input);

		if (!isValid) {
			throw new BadRequestException(Message.NO_DATA_FOUND);
		}

		return {
			message: 'Credentials verified. You can now reset your password.',
			success: true,
		};
	}

	@Mutation(() => MessageResponse)
	public async resetPassword(@Args('input') input: ResetPasswordInput): Promise<MessageResponse> {
		console.log('Mutation: resetPassword');
		console.log('Input:', { ...input, newPassword: '***' });

		const isReset = await this.authService.resetPassword(input);

		if (!isReset) {
			throw new BadRequestException(Message.UPDATE_FAILED);
		}

		return {
			message: 'Password reset successfully. You can now login with your new password.',
			success: true,
		};
	}
}
