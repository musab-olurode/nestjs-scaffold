import {
	Body,
	Controller,
	Get,
	HttpCode,
	Patch,
	Post,
	Req,
	Res,
	UseGuards,
} from '@nestjs/common';

import { GoogleOauthGuard } from '@/app/auth/guards/google-oauth.guard';
import { LocalAuthGuard } from '@/app/auth/guards/local-auth.guard';
import { TwitterOauthGuard } from '@/app/auth/guards/twitter-oauth.guard';

import { Public } from '@/decorators/public.decorator';
import { CurrentUser } from '@/decorators/user.decorator';

import { User } from '@/app/users/entities/user.entity';

import { ForgotPasswordDto } from '@/app/auth/dto/forgot-password.dto';
import { RefreshTokenDto } from '@/app/auth/dto/refresh-token.dto';
import { ResetPasswordDto } from '@/app/auth/dto/reset-password.dto';
import { SignupUserDto } from '@/app/auth/dto/signup-user.dto';
import { UpdatePasswordDto } from '@/app/auth/dto/update-password.dto';
import { VerifyEmailDto } from '@/app/auth/dto/verify-email.dto';

import { AuthService } from '@/app/auth/auth.service';

import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@UseGuards(LocalAuthGuard)
	@Post('signin')
	@HttpCode(200)
	signin(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) response: Response,
	) {
		return this.authService.signin(user, response);
	}

	@Public()
	@UseGuards(GoogleOauthGuard)
	@Get('/signin/google')
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	googleOauthSignin() {}

	@Public()
	@UseGuards(GoogleOauthGuard)
	@Get('/signin/google/redirect')
	googleOauthRedirect(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) response: Response,
	) {
		return this.authService.socialSignin(user, response);
	}

	@Public()
	@UseGuards(TwitterOauthGuard)
	@Get('/signin/twitter')
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	twitterOauthSignin() {}

	@Public()
	@UseGuards(TwitterOauthGuard)
	@Get('/signin/twitter/redirect')
	twitterOauthRedirect(
		@CurrentUser() user: User,
		@Res({ passthrough: true }) response: Response,
	) {
		return this.authService.socialSignin(user, response);
	}

	@Public()
	@Post('signup')
	signup(
		@Body() signupUserDto: SignupUserDto,
		@Res({ passthrough: true }) response: Response,
	) {
		return this.authService.signup(signupUserDto, response);
	}

	@Public()
	@Post('forgot-password')
	forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
		return this.authService.forgotPassword(forgotPasswordDto);
	}

	@Public()
	@Post('reset-password')
	resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
		return this.authService.resetPassword(resetPasswordDto);
	}

	@Patch('update-password')
	updatePassword(
		@CurrentUser() user: User,
		@Body() updatePasswordDto: UpdatePasswordDto,
	) {
		return this.authService.updatePassword(user, updatePasswordDto);
	}

	@Get('me')
	findAuthUser(@CurrentUser() user: User) {
		return this.authService.findAuthUser(user.id);
	}

	@Post('email/send-verification')
	sendEmailVerification(@CurrentUser() user: User) {
		return this.authService.sendEmailVerification(user);
	}

	@Public()
	@Post('email/verify')
	verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
		return this.authService.verifyEmail(verifyEmailDto.token);
	}

	@Public()
	@Post('refresh')
	refreshToken(
		@Body() refreshTokenDto: RefreshTokenDto,
		@Req() request: Request,
		@Res({ passthrough: true }) response: Response,
	) {
		return this.authService.refreshToken(
			request,
			response,
			refreshTokenDto.refreshToken,
		);
	}

	@Public()
	@Post('signout')
	@HttpCode(200)
	signout(@Res({ passthrough: true }) response: Response) {
		return this.authService.signout(response);
	}
}
