import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';

import { AdminModule } from '@/app/admin/admin.module';
import { AuthModule } from '@/app/auth/auth.module';
import { OtpModule } from '@/app/otp/otp.module';
import { UsersModule } from '@/app/users/users.module';
import { DatabaseModule } from '@/database/database.module';
import { MailModule } from '@/mail/mail.module';

import { ErrorsInterceptor } from '@/interceptor/error.interceptor';
import { RequestLoggingInterceptor } from '@/interceptor/request-logging.interceptor';

import { JwtAuthGuard } from '@/app/auth/guards/jwt-auth.guard';

import { validate } from '@/validation/env.validation';

import { AppController } from '@/app/app.controller';

import { AppService } from '@/app/app.service';
import { WinstonLoggerService } from '@/logger/winston-logger/winston-logger.service';

import configuration from '@/config/configuration';
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			expandVariables: true,
			load: [() => configuration],
			validate,
		}),
		DatabaseModule,
		UsersModule,
		AuthModule,
		OtpModule,
		MailModule,
		AdminModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		WinstonLoggerService,
		{
			provide: APP_INTERCEPTOR,
			useClass: RequestLoggingInterceptor,
		},
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: ErrorsInterceptor,
		},
	],
})
export class AppModule {}
