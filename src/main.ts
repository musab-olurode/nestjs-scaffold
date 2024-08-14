import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { validationExceptionFactory } from './utils/validation';
import * as session from 'express-session';
import * as passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	const config: ConfigService = app.get(ConfigService);

	app.setGlobalPrefix('v1');
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			exceptionFactory: validationExceptionFactory,
		}),
	);
	app.enableCors({
		origin: [
			config.get<string>('clientUrl'),
			config.get<string>('debugClientUrl'),
		],
		credentials: true,
	});
	const sessionSecret = config.get<string>('passportSessionSecret');
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

	const port = config.get<number>('port');
	await app.listen(port);
}
bootstrap();
