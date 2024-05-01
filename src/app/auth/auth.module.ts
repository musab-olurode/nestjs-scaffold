import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleOauthStrategy } from './strategies/google-oauth.strategy';
import { TwitterOauthStrategy } from './strategies/twitter-oauth.strategy';
import { SessionSerializer } from './strategies/session.serializer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { PasswordReset } from './entities/password-reset.entity';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../../mail/mail.module';
import { WinstonLoggerService } from '../../logger/winston-logger/winston-logger.service';
import { JwtModule } from '@nestjs/jwt';
import configuration from '../../config/configuration';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, PasswordReset]),
    PassportModule.register({ session: true }),
    UsersModule,
    MailModule,
    JwtModule.register({
      secret: configuration().jwt.secret,
      signOptions: { expiresIn: configuration().jwt.expiresIn },
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
