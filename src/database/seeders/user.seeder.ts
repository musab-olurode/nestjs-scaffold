import { User } from '@/app/users/entities/user.entity';

import { AppPermissions } from '@/app/auth/permissions/app.permission';
import configuration from '@/config/configuration';
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
			await new UserFactory().create({
				firstName: 'Dev',
				lastName: 'Admin',
				permissions: [
					AppPermissions.CREATE_USERS,
					AppPermissions.READ_USERS,
					AppPermissions.UPDATE_USERS,
				],
				email: configuration.SUPER_ADMIN_EMAIL,
				password: configuration.SUPER_ADMIN_PASSWORD,
			});
		}

		await new UserFactory().createMany(20);
	}
}
