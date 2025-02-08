import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { EnvironmentVariables } from '@/validation/env.validation';

import { User } from '@/app/users/entities/user.entity';

import { UsersService } from '@/app/users/users.service';

import { AppPermissions } from '@/app/auth/permissions/app.permission';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

export interface JwtPayload {
	sub: string;
	permissions: AppPermissions[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		private configService: ConfigService<EnvironmentVariables, true>,
		private readonly usersService: UsersService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromExtractors([
				(request: Request) => {
					return request.cookies.accessToken;
				},
				ExtractJwt.fromAuthHeaderAsBearerToken(),
			]),
			secretOrKey: configService.get('JWT_SECRET'),
			passReqToCallback: true,
		});
	}

	async validate(req: Request, payload: JwtPayload) {
		let user: User;

		try {
			user = await this.usersService.findOneProfile(payload.sub);
		} catch (error) {
			throw new UnauthorizedException('Unauthorized');
		}

		return user;
	}
}
