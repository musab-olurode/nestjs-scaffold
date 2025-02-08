import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '@/app/users/users.module';
import { MailModule } from '@/mail/mail.module';

import { GoogleOauthStrategy } from '@/app/auth/strategies/google-oauth.strategy';
import { JwtStrategy } from '@/app/auth/strategies/jwt.strategy';
import { LocalStrategy } from '@/app/auth/strategies/local.strategy';
import { TwitterOauthStrategy } from '@/app/auth/strategies/twitter-oauth.strategy';

import { PasswordReset } from '@/app/auth/entities/password-reset.entity';
import { User } from '@/app/users/entities/user.entity';

import { AuthController } from '@/app/auth/auth.controller';

import { AuthService } from '@/app/auth/auth.service';
import { WinstonLoggerService } from '@/logger/winston-logger/winston-logger.service';

import { SessionSerializer } from '@/app/auth/strategies/session.serializer';
import configuration from '@/config/configuration';

@Module({
	imports: [
		TypeOrmModule.forFeature([User, PasswordReset]),
		PassportModule.register({ session: true }),
		UsersModule,
		MailModule,
		JwtModule.register({
			secret: configuration.JWT_SECRET,
			signOptions: { expiresIn: configuration.JWT_EXPIRE },
		}),
	],
	controllers: [AuthController],
	providers: [
		AuthService,
		LocalStrategy,
		JwtStrategy,
		GoogleOauthStrategy,
		TwitterOauthStrategy,
		SessionSerializer,
		WinstonLoggerService,
	],
})
export class AuthModule {}
