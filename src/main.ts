import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from './utils/validation';
import * as session from 'express-session';
import * as passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as cookieParser from 'cookie-parser';
import { EnvironmentVariables } from './validation/env.validation';

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
			config.get<string>('CLIENT_URL'),
			config.get<string>('DEBUG_CLIENT_URL'),
			new RegExp(config.get<string>('PREVIEW_CLIENT_URL')),
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
