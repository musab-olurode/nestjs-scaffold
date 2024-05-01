import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

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
      existingSocialAuthProviderUser.identityProviderId
    ) {
      const identityProviderString =
        existingSocialAuthProviderUser.identityProvider.toLowerCase();
      throw new UnauthorizedException(
        `It looks like you've already signed up with ${identityProviderString} using this email address. Please sign in with ${identityProviderString} to access your account.`,
      );
    }

    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }
}
