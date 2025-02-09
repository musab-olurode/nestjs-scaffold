import { User } from '@/app/users/entities/user.entity';

import { AppDataSource } from '@/database/ormconfig';

import { FactorizedAttrs, Factory } from '@jorgebodega/typeorm-factory';
import {
	randEmail,
	randFirstName,
	randLastName,
	randPassword,
} from '@ngneat/falso';

export class UserFactory extends Factory<User> {
	protected entity = User;
	protected dataSource = AppDataSource;
	protected attrs(): FactorizedAttrs<User> {
		return {
			email: randEmail(),
			password: randPassword() as unknown as string,
			firstName: randFirstName(),
			lastName: randLastName(),
			emailVerified: true,
		};
	}
}
