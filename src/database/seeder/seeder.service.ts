import { Injectable, Logger } from '@nestjs/common';

import { UsersSeederService } from '@/database/seeder/users/users.seeder.service';

@Injectable()
export class SeederService {
	constructor(private readonly userSeederService: UsersSeederService) {}

	SEEDERS = [this.userSeederService];

	async seed() {
		// Run Seeders
		const results = await Promise.all(
			this.SEEDERS.map(async (seeder) => {
				const seederName = this.extractSeederName(seeder.constructor.name);
				const logger = new Logger(seederName, { timestamp: true });

				try {
					const completed = await seeder.create();

					logger.log('Seeding completed');

					return completed;
				} catch (error) {
					logger.error('Seeding failed', error);
					throw error;
				}
			}),
		);

		return results;
	}

	private extractSeederName(className: string) {
		let seederName = className;
		const seederNameParts = seederName.split('Service');

		seederName = seederNameParts.length > 0 ? seederNameParts[0] : seederName;

		return seederName;
	}
}
