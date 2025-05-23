import { createAccessControl } from 'better-auth/plugins/access';
import { adminAc, defaultStatements } from 'better-auth/plugins/admin/access';

const statement = {
	...defaultStatements,
	// project: ['create', 'share', 'update', 'delete'],
} as const;

export type AccessControlStatement = typeof statement;

export const ac = createAccessControl(statement);

export const admin = ac.newRole({
	// project: ['create', 'update'],
	...adminAc.statements,
});
