import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/app/users/users.service';
import { IdentityProvider } from '../../../types/user';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
	constructor(
		configService: ConfigService,
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {
		super({
			clientID: configService.get<string>('oauth.googleClientId'),
			clientSecret: configService.get<string>('oauth.googleClientSecret'),
			callbackURL:
				configService.get<string>('clientUrl') + '/auth/login/social-redirect',
			scope: ['email', 'profile'],
		});
	}

	async validate(
		_accessToken: string,
		_refreshToken: string,
		profile: Profile,
	) {
		const { id, name, emails } = profile;

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
			throw new BadRequestException(
				'You cannot sign in with your Google account because an account with this email address already exists',
			);
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
