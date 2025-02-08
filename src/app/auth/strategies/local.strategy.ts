import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../auth.service';

import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'email' });
	}

	async validate(email: string, password: string) {
		const existingSocialAuthProviderUser = await this.authService.findOneUser(
			{
				email,
			},
			{
				id: true,
				identityProvider: true,
				identityProviderId: true,
			},
		);

		if (
			existingSocialAuthProviderUser &&
			existingSocialAuthProviderUser.identityProvider
		) {
			throw new UnauthorizedException('Invalid credentials');
		}

		const user = await this.authService.validateUser(email, password);

		if (!user) {
			throw new UnauthorizedException('Invalid credentials');
		}

		return user;
	}
}
