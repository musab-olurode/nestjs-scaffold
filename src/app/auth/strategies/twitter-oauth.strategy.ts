import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-twitter';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/app/users/users.service';
import { IdentityProvider } from '../../../types/user';
import { AuthService } from '../auth.service';
import { EnvironmentVariables } from '../../../validation/env.validation';

@Injectable()
export class TwitterOauthStrategy extends PassportStrategy(
	Strategy,
	'twitter',
) {
	constructor(
		configService: ConfigService<EnvironmentVariables, true>,
		private readonly authService: AuthService,
		private readonly usersService: UsersService,
	) {
		super({
			consumerKey: configService.get<string>('OAUTH_TWITTER_CONSUMER_KEY'),
			consumerSecret: configService.get<string>(
				'OAUTH_TWITTER_CONSUMER_SECRET',
			),
			callbackURL:
				configService.get<string>('CLIENT_URL') + '/auth/login/social-redirect',
			includeEmail: true,
		});
	}

	async validate(
		_accessToken: string,
		_refreshToken: string,
		profile: Profile,
	) {
		const { id, emails, name } = profile;

		const existingNonTwitterProviderUser = await this.authService.findOneUser(
			{
				email: emails[0].value,
			},
			{
				id: true,
				identityProvider: true,
			},
		);

		if (
			existingNonTwitterProviderUser &&
			existingNonTwitterProviderUser.identityProvider !==
				IdentityProvider.TWITTER
		) {
			throw new BadRequestException(
				'You cannot sign in with your Twitter account because an account with this email address already exists',
			);
		}

		let user = await this.authService.findOauthUser(
			IdentityProvider.TWITTER,
			id,
		);

		if (!user) {
			user = await this.usersService.create({
				identityProvider: IdentityProvider.TWITTER,
				identityProviderId: id,
				firstName: name.givenName,
				lastName: name.familyName,
				email: emails[0].value,
			});
		}

		return user;
	}
}
