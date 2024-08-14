import { Injectable } from '@nestjs/common';
import { UsersSeederService } from './users/users.seeder.service';

@Injectable()
export class SeederService {
	constructor(private readonly userSeederService: UsersSeederService) {}

	SEEDERS = [this.userSeederService];

	async seed() {
		// Run Seeders
		for (const seeder of this.SEEDERS) {
			await seeder
				.create()
				.then((completed) => {
					const dateString = new Date().toLocaleString();
					const seederName = this.extractSeederName(seeder.constructor.name);
					console.log(
						`[Seeder] ${process.pid} - ${dateString}    LOG [${seederName}] Seeding completed`,
					);
					Promise.resolve(completed);
				})
				.catch((error) => {
					const dateString = new Date().toLocaleString();
					const seederName = this.extractSeederName(seeder.constructor.name);
					console.log(
						`[Seeder] ${process.pid} - ${dateString}    LOG [${seederName}] Seeding failed`,
					);
					Promise.reject(error);
				});
		}
	}

	private extractSeederName(className: string) {
		let seederName = className;
		const seederNameParts = seederName.split('Seeder');
		seederName = seederNameParts.length > 0 ? seederNameParts[0] : seederName;
		return seederName;
	}
}
