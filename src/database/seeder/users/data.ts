import { User } from '@/app/users/entities/user.entity';

import { AppPermissions } from '@/app/auth/permissions/app.permission';

export const SUPER_ADMIN: Pick<
	User,
	'firstName' | 'lastName' | 'emailVerified' | 'permissions'
> = {
	firstName: 'Dev',
	lastName: 'admin',
	emailVerified: true,
	permissions: [
		AppPermissions.CREATE_USERS,
		AppPermissions.READ_USERS,
		AppPermissions.UPDATE_USERS,
	],
};
