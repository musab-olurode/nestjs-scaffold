import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';

import { EnvironmentVariables } from '@/validation/env.validation';

import { OTP } from '@/app/otp/entities/otp.entity';
import { User } from '@/app/users/entities/user.entity';

import { OTPReasonText } from '@/types/otp';

@Injectable()
export class MailService {
	constructor(
		private mailerService: MailerService,
		private configService: ConfigService<EnvironmentVariables, true>,
	) {}

	async sendResetPassword(user: User, resetToken: string) {
		const url = `${this.configService.get<string>(
			'CLIENT_URL',
		)}/auth/forgot-password/reset?token=${resetToken}`;

		await this.mailerService.sendMail({
			to: user.email,
			subject: 'Password Reset',
			template: './forgotPassword',
			context: {
				url,
				name: user.firstName,
				email: user.email,
			},
		});
	}

	async sendCustomMessage(
		receivers: string[],
		subject: string,
		message: string,
	) {
		await this.mailerService.sendMail({
			to: receivers,
			subject,
			template: './customMessage',
			context: {
				message,
				subject,
			},
		});
	}

	async sendOtp(user: User, otp: OTP) {
		await this.mailerService.sendMail({
			to: user.email,
			subject: `${OTPReasonText[otp.reason]} OTP`,
			template: './otp',
			context: {
				otpReason: OTPReasonText[otp.reason],
				otp: otp.code,
				name: user.firstName,
				email: user.email,
			},
		});
	}

	async sendEmailVerification(user: User, verificationToken: string) {
		const url = `${this.configService.get<string>(
			'CLIENT_URL',
		)}/auth/verify-email?token=${verificationToken}`;

		await this.mailerService.sendMail({
			to: user.email,
			subject: 'Verify Email',
			template: './verifyEmail',
			context: {
				url,
				name: user.firstName,
				email: user.email,
			},
		});
	}
}
