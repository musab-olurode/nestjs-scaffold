import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';

import { AppModule } from '@/app/app.module';

import { EnvironmentVariables } from '@/validation/env.validation';

import { CLIENT_URL_REGEX, PREVIEW_CLIENT_URL_REGEX } from '@/utils/constants';
import { validationExceptionFactory } from '@/utils/validation';

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule, {
		bodyParser: false,
	});

	app.set('query parser', 'extended');

	const config: ConfigService<EnvironmentVariables, true> =
		app.get(ConfigService);

	app.setGlobalPrefix('v1');
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			exceptionFactory: validationExceptionFactory,
		}),
	);

	const trustedOrigins = config.get<string>('TRUSTED_ORIGINS').split(',');

	app.enableCors({
		origin: [
			...trustedOrigins,
			new RegExp(CLIENT_URL_REGEX),
			new RegExp(PREVIEW_CLIENT_URL_REGEX),
		],
		credentials: true,
	});

	const port = config.get<number>('PORT');

	await app.listen(port);
}
void bootstrap();
