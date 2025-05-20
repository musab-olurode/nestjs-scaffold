import { User } from '@/app/users/entities/user.entity';

import auth from '@/app/auth/auth';
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
			firstName: randFirstName(),
			lastName: randLastName(),
			emailVerified: false,
		};
	}
	async createMany(
		amount: number,
		overrideParams?: Partial<FactorizedAttrs<User>>,
	): Promise<User[]> {
		const createPromises = Array.from({ length: amount }, () => {
			const params = {
				...this.attrs(),
				...(overrideParams ?? {}),
			};

			return auth.api.createUser({
				body: {
					email: params.email,
					password: randPassword() as unknown as string,
					name: params.firstName,
					lastName: params.lastName,
				} as {
					email: string;
					password: string;
					name: string;
					lastName: string;
				},
			});
		});

		const users = await Promise.all(createPromises);

		return users.map((user) => user.user as unknown as User);
	}
}
