import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { SeederModule } from './seeder.module';

import { SeederService } from './seeder.service';

function bootstrap() {
	NestFactory.createApplicationContext(SeederModule)
		.then((appContext) => {
			const seeder = appContext.get(SeederService);
			const logger = new Logger('Seeder', { timestamp: true });

			logger.debug('Seeding started');

			seeder
				.seed()
				.then(() => {
					logger.debug('Seeding completed');
				})
				.catch((error) => {
					logger.error('Seeding failed', error);
					throw error;
				})
				.finally(() => appContext.close());
		})
		.catch((error) => {
			throw error;
		});
}
bootstrap();
