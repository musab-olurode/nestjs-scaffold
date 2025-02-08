import {
	BadRequestException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { EnvironmentVariables } from '@/validation/env.validation';

import { AuthService } from '@/app/auth/auth.service';
import { UsersService } from '@/app/users/users.service';

import { IdentityProvider } from '@/types/user';

import { Profile, Strategy } from 'passport-google-oauth20';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
		configService: ConfigService<EnvironmentVariables, true>,
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {
		super({
			clientID: configService.get<string>('OAUTH_GOOGLE_ID'),
			clientSecret: configService.get<string>('OAUTH_GOOGLE_SECRET'),
			callbackURL:
				configService.get<string>('CLIENT_URL') + '/auth/login/social-redirect',
			scope: ['email', 'profile'],
		});
	}

	async validate(
		_accessToken: string,
		_refreshToken: string,
		profile: Profile,
	) {
		const { id, name, emails } = profile;

		if (!emails || emails.length === 0 || !name) {
			throw new BadRequestException('Invalid profile');
		}

		const existingNonGoogleProviderUser = await this.authService.findOneUser(
			{
				email: emails[0].value,
			},
			{
				id: true,
				identityProvider: true,
			},
		);

		if (
			existingNonGoogleProviderUser &&
			existingNonGoogleProviderUser.identityProvider !== IdentityProvider.GOOGLE
		) {
			throw new UnauthorizedException('Invalid credentials');
		}

		let user = await this.authService.findOauthUser(
			IdentityProvider.GOOGLE,
			id,
		);

		if (!user) {
			user = await this.usersService.create({
				identityProvider: IdentityProvider.GOOGLE,
				identityProviderId: id,
				firstName: name.givenName,
				lastName: name.familyName,
				email: emails[0].value,
			});
		}

		return user;
	}
}
