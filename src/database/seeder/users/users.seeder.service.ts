import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArrayContains, Repository } from 'typeorm';
import { User } from '../../../app/users/entities/user.entity';
import { SUPER_ADMIN } from './data';
import configuration from '../../../config/configuration';
import { SeederServiceProvider } from '../../../types/seeder';
import { AppPermissions } from '../../../app/auth/permissions/app.permission';

@Injectable()
export class UsersSeederService implements SeederServiceProvider {
	constructor(
		@InjectRepository(User)
		private userRepository: Repository<User>,
	) {}

	async create() {
		await this.createSuperAdmin();
	}

	private async createSuperAdmin() {
		const existingSuperAdmin = await this.userRepository.findOne({
			where: {
				email: configuration.SUPER_ADMIN_EMAIL,
				permissions: ArrayContains([
					AppPermissions.CREATE_USERS,
					AppPermissions.READ_USERS,
					AppPermissions.UPDATE_USERS,
				]),
			},
		});

		if (existingSuperAdmin) {
			return existingSuperAdmin;
		}

		const superAdmin = this.userRepository.create({
			...SUPER_ADMIN,
			email: configuration.SUPER_ADMIN_EMAIL,
			password: configuration.SUPER_ADMIN_PASSWORD,
		});

		return await this.userRepository.save(superAdmin);
	}
}
