import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from '@/app/app.module';

import { EnvironmentVariables } from '@/validation/env.validation';

import { CLIENT_URL_REGEX, PREVIEW_CLIENT_URL_REGEX } from '@/utils/constants';

import * as cookieParser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';

import { validationExceptionFactory } from './utils/validation';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const config: ConfigService<EnvironmentVariables, true> =
		app.get(ConfigService);

	app.setGlobalPrefix('v1');
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			exceptionFactory: validationExceptionFactory,
		}),
	);
	app.enableCors({
		origin: [
			new RegExp(CLIENT_URL_REGEX),
			new RegExp(PREVIEW_CLIENT_URL_REGEX),
		],
		credentials: true,
	});
	const sessionSecret = config.get<string>('PASSPORT_SESSION_SECRET');

	app.set('trust proxy', 1);
	app.use(
		session({
			secret: sessionSecret,
			resave: false,
			saveUninitialized: true,
			proxy: true,
			cookie: { secure: true, sameSite: 'none' },
		}),
	);
	app.use(passport.initialize());
	app.use(passport.session());
	app.use(cookieParser());

	const port = config.get<number>('PORT');

	await app.listen(port);
}
bootstrap();
