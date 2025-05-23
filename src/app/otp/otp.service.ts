import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { EnvironmentVariables } from '@/validation/env.validation';

import { OTP } from '@/app/otp/entities/otp.entity';
import { User } from '@/app/users/entities/user.entity';

import { OTPReason } from '@/types/otp';

import { MoreThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class OtpService {
	constructor(
		@InjectRepository(OTP)
		private readonly otpRepository: Repository<OTP>,
		private readonly configService: ConfigService<EnvironmentVariables, true>,
	) {
		this.OTPExpiryInMs = this.configService.get<number>('SECURE_TOKEN_EXPIRY');
	}

	private readonly OTPExpiryInMs: number;

	async generateOtp(otpReason: OTPReason, user: User): Promise<OTP> {
		const fourDigitOtp = Math.floor(1000 + Math.random() * 9000).toString();

		const existingOtp = await this.otpRepository.findOne({
			where: {
				reason: otpReason,
				code: fourDigitOtp,
				user: { id: user.id },
			},
		});

		if (existingOtp) {
			return this.generateOtp(otpReason, user);
		}

		const otp = this.otpRepository.create({
			reason: otpReason,
			code: fourDigitOtp,
			user,
		});

		return await this.otpRepository.save(otp);
	}

	async findOrCreateOtp(otpReason: OTPReason, user: User) {
		const otp = await this.otpRepository.findOne({
			where: {
				reason: otpReason,
				user: { id: user.id },
				createdAt: MoreThanOrEqual(new Date(Date.now() - this.OTPExpiryInMs)),
			},
		});

		if (otp) {
			return otp;
		}

		return await this.generateOtp(otpReason, user);
	}

	async verifyOtp(otp: string, user: User, otpReason: OTPReason) {
		const validOtp = await this.otpRepository.findOne({
			where: {
				reason: otpReason,
				code: otp,
				user: { id: user.id },
				createdAt: MoreThanOrEqual(new Date(Date.now() - this.OTPExpiryInMs)),
			},
		});

		if (!validOtp) {
			return false;
		}

		await this.otpRepository.delete(validOtp.id);

		return true;
	}
}
