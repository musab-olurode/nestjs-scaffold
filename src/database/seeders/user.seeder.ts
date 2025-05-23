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
					email: configuration.SUPER_ADMIN_EMAIL,
					password: configuration.SUPER_ADMIN_PASSWORD,
					role: 'admin',
					data: {
						lastName: 'Admin',
					},
				},
			});
		}

		await new UserFactory().createMany(20);
	}
}
