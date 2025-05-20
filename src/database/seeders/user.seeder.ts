import { User } from '@/app/users/entities/user.entity';

import auth from '@/app/auth/auth';
import configuration from '@/config/configuration';
// import { AppPermissions } from '@/app/auth/permissions/app.permission';
import { UserFactory } from '@/database/factories/user.factory';

import { Seeder } from '@jorgebodega/typeorm-seeding';
import { DataSource } from 'typeorm';

export default class UserSeeder extends Seeder {
	async run(dataSource: DataSource) {
		const entityManager = dataSource.createEntityManager();

		const existingSuperAdmin = await entityManager.findOne(User, {
			where: { email: configuration.SUPER_ADMIN_EMAIL },
		});

		if (!existingSuperAdmin) {
			await auth.api.createUser({
				body: {
					name: 'Dev',
					lastName: 'Admin',
					email: configuration.SUPER_ADMIN_EMAIL,
					password: configuration.SUPER_ADMIN_PASSWORD,
					role: 'admin',
				} as {
					name: string;
					lastName: string;
					email: string;
					password: string;
				},
			});
		}

		await new UserFactory().createMany(20);
	}
}
