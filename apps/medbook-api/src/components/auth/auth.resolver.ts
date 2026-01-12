import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { AuthGuard } from './guards/auth.guard';
import { Message } from '../../libs/enums/common.enum';
import { MessageResponse } from '../../libs/dto/auth/auth.response';
import { ForgotPasswordInput } from '../../libs/dto/auth/forgotPassword';

@Resolver()
export class AuthResolver {
    constructor(private readonly authService: AuthService) {}
 
    @Mutation(() => MessageResponse)
    public async forgotPassword(
        @Args('input') input: ForgotPasswordInput,
    ): Promise<MessageResponse> {
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
}
