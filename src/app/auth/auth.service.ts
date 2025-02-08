import {
	BadRequestException,
	HttpStatus,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import { JwtPayload } from '@/app/auth/strategies/jwt.strategy';

import { Environment, EnvironmentVariables } from '@/validation/env.validation';

import { PasswordReset } from '@/app/auth/entities/password-reset.entity';
import { User } from '@/app/users/entities/user.entity';

import { ForgotPasswordDto } from '@/app/auth/dto/forgot-password.dto';
import { ResetPasswordDto } from '@/app/auth/dto/reset-password.dto';
import { SignupUserDto } from '@/app/auth/dto/signup-user.dto';
import { UpdatePasswordDto } from '@/app/auth/dto/update-password.dto';

import { UsersService } from '@/app/users/users.service';
import { WinstonLoggerService } from '@/logger/winston-logger/winston-logger.service';
import { MailService } from '@/mail/mail.service';

import { IdentityProvider } from '@/types/user';
import { generateToken } from '@/utils';
import { SuccessResponse } from '@/utils/response';

import { CookieOptions, Request, Response } from 'express';
import {
	FindOptionsSelect,
	FindOptionsWhere,
	MoreThanOrEqual,
	Repository,
} from 'typeorm';

@Injectable()
export class AuthService {
	constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>,
		@InjectRepository(PasswordReset)
		private readonly passwordResetRepository: Repository<PasswordReset>,
		private readonly logger: WinstonLoggerService,
		private jwtService: JwtService,
		private readonly configService: ConfigService<EnvironmentVariables, true>,
		private mailService: MailService,
		private readonly usersService: UsersService,
	) {
		this.logger.setContext(AuthService.name);
	}

	private ResetTokenExpiryInMs = this.configService.get<number>(
		'SECURE_TOKEN_EXPIRY',
	);

	async validateUser(
		email: string,
		enteredPassword: string,
	): Promise<User | null> {
		const user = await this.userRepository
			.createQueryBuilder('user')
			.where('user.email = :email', { email })
			.addSelect('user.password')
			.getOne();

		if (!user) {
			return null;
		}

		const isMatch = await user.matchPassword(enteredPassword);

		if (!isMatch) {
			return null;
		}

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...result } = user;

		return result as User;
	}

	async findOneUser(
		filter: FindOptionsWhere<User>,
		select?: FindOptionsSelect<User>,
	) {
		return await this.userRepository.findOne({ where: filter, select });
	}

	async findOauthUser(
		identityProvider: IdentityProvider,
		identityProviderId: string,
	) {
		const user = await this.userRepository
			.createQueryBuilder('user')
			.where('user.identityProvider = :identityProvider', { identityProvider })
			.andWhere('user.identityProviderId = :identityProviderId', {
				identityProviderId,
			})
			.getOne();

		return user;
	}

	postSignin(user: User, response: Response) {
		const payload: JwtPayload = { sub: user.id, permissions: user.permissions };

		const {
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			password,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			emailVerificationToken,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			identityProvider,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			identityProviderId,
			...parsedUser
		} = user;

		const accessToken = this.jwtService.sign(payload);
		const refreshToken = this.jwtService.sign(payload, {
			secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
			expiresIn: this.configService.get<string>('REFRESH_JWT_EXPIRE'),
		});

		const cookieOptions = this.getCookieOptions();

		response.cookie('accessToken', accessToken, {
			...cookieOptions,
			expires: new Date(
				Date.now() + this.configService.get<number>('JWT_COOKIE_EXPIRE'),
			),
		});
		response.cookie('refreshToken', refreshToken, {
			...cookieOptions,
			expires: new Date(
				Date.now() +
					this.configService.get<number>('REFRESH_JWT_COOKIE_EXPIRE'),
			),
		});

		return {
			user: parsedUser,
			accessToken,
			refreshToken,
		};
	}

	signin(user: User, response: Response) {
		const signinResponse = this.postSignin(user, response);

		return new SuccessResponse('Signin successful', signinResponse);
	}

	socialSignin(user: User, response: Response) {
		const signInResponse = this.postSignin(user, response);

		return new SuccessResponse('Signin successful', signInResponse);
	}

	async signup(signupUserDto: SignupUserDto, response: Response) {
		const existingUserWithEmail = await this.findOneUser(
			{
				email: signupUserDto.email,
			},
			{
				id: true,
				identityProvider: true,
				identityProviderId: true,
			},
		);

		if (existingUserWithEmail) {
			throw new BadRequestException(
				`It looks like you've already signed up with this email address. Please sign in to access your account.`,
			);
		}

		const user = this.userRepository.create({
			...signupUserDto,
			permissions: [],
		});

		await this.userRepository.save(user);

		const signupResponse = this.postSignin(user, response);

		return new SuccessResponse(
			'Signup successful',
			signupResponse,
			HttpStatus.CREATED,
		);
	}

	async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
		const user = await this.userRepository.findOne({
			where: { email: forgotPasswordDto.email },
			select: ['id', 'email', 'firstName', 'lastName', 'identityProvider'],
		});

		if (user) {
			if (user.identityProvider) {
				const identityProviderString = user.identityProvider.toLowerCase();

				throw new BadRequestException(
					`It looks like you signed up with your ${identityProviderString} account using this email address. Please sign in with ${identityProviderString} to access your account.`,
				);
			}

			const passwordResetToken = await this.findOrCreatePasswordReset(user);

			await this.mailService.sendResetPassword(user, passwordResetToken.token);
		}

		return new SuccessResponse(
			`If you  previously registered with email ${forgotPasswordDto.email}, you will receive a mail with a reset password link`,
			{},
		);
	}

	async resetPassword(resetPasswordDto: ResetPasswordDto) {
		const passwordReset = await this.passwordResetRepository.findOne({
			where: {
				token: resetPasswordDto.token,
				createdAt: MoreThanOrEqual(
					new Date(Date.now() - this.ResetTokenExpiryInMs),
				),
			},
			relations: { user: true },
		});

		if (!passwordReset) {
			throw new BadRequestException('Invalid token');
		}

		const user = passwordReset.user;

		user.password = resetPasswordDto.password;
		await this.userRepository.save(user);

		await this.passwordResetRepository.remove(passwordReset);

		return new SuccessResponse('Password reset successfully', {});
	}

	async findOrCreatePasswordReset(user: User) {
		const passwordReset = await this.passwordResetRepository.findOne({
			where: {
				user: { id: user.id },
				createdAt: MoreThanOrEqual(
					new Date(Date.now() - this.ResetTokenExpiryInMs),
				),
			},
		});

		if (passwordReset) {
			return passwordReset;
		}

		const newPasswordReset = this.passwordResetRepository.create({
			user,
		});

		return this.passwordResetRepository.save(newPasswordReset);
	}

	async updatePassword(user: User, updatePasswordDto: UpdatePasswordDto) {
		user = (await this.userRepository
			.createQueryBuilder('user')
			.where('user.id = :id', { id: user.id })
			.addSelect('user.password')
			.getOne()) as User;

		const isPasswordMatch = await user.matchPassword(
			updatePasswordDto.oldPassword,
		);

		if (!isPasswordMatch) {
			throw new UnauthorizedException('Invalid old password');
		}

		user.password = updatePasswordDto.password;
		await this.userRepository.save(user);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { password, ...result } = user;

		return new SuccessResponse('Password updated successfully', {
			user: result,
		});
	}

	findAuthUser(id: string) {
		return this.usersService.findOneProfile(id);
	}

	async sendEmailVerification(user: User) {
		const emailVerificationToken = await this.generateEmailVerificationToken();

		await this.mailService.sendEmailVerification(user, emailVerificationToken);

		await this.userRepository.update(user.id, {
			emailVerificationToken,
		});

		return new SuccessResponse(
			'Email verification sent successfully. Please check your email',
			{},
		);
	}

	async generateEmailVerificationToken() {
		let emailVerificationToken = generateToken();

		const userExists = await this.userRepository.findOne({
			where: { emailVerificationToken },
		});

		if (userExists) {
			emailVerificationToken = await this.generateEmailVerificationToken();
		}

		return emailVerificationToken;
	}

	async verifyEmail(verificationToken: string) {
		const user = await this.userRepository.findOne({
			where: { emailVerificationToken: verificationToken },
		});

		if (!user) {
			throw new BadRequestException('Invalid verification token');
		}

		await this.userRepository.update(user.id, {
			emailVerified: true,
			emailVerificationToken: null,
		});

		return new SuccessResponse('Email verified successfully', {});
	}

	async refreshToken(
		request: Request,
		response: Response,
		refreshToken?: string,
	) {
		let userId: string;

		try {
			const { sub: payloadSub } = this.jwtService.verify(
				refreshToken || request.cookies.refreshToken,
				{
					secret: this.configService.get<string>('REFRESH_JWT_SECRET'),
				},
			);

			userId = payloadSub;
		} catch (error) {
			throw new UnauthorizedException('Invalid token');
		}

		const user = await this.usersService.findOneProfile(userId);

		const refreshTokenResponse = this.postSignin(user, response);

		return new SuccessResponse(
			'Token refreshed successfully',
			refreshTokenResponse,
		);
	}

	private getCookieOptions() {
		const isProduction =
			this.configService.get<Environment>('NODE_ENV') === 'production';
		const clientUrlParts = this.configService
			.get<string>('CLIENT_URL')
			.split('//');
		let cookieDomain = clientUrlParts[1];

		if (cookieDomain.startsWith('www.')) {
			cookieDomain = cookieDomain.slice(4);
		}

		const cookieOptions: CookieOptions = {
			httpOnly: true,
			sameSite: 'lax',
			domain: isProduction ? cookieDomain : undefined,
			secure: isProduction,
		};

		return cookieOptions;
	}

	signout(response: Response) {
		const cookieOptions = this.getCookieOptions();

		response.clearCookie('accessToken', cookieOptions);
		response.clearCookie('refreshToken', cookieOptions);

		return new SuccessResponse('Signout successful', {});
	}
}
