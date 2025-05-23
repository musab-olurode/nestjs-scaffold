import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { User } from '@/app/users/entities/user.entity';

import { AUTH_INSTANCE_KEY } from '@/app/auth/symbols';

import type { getSession } from 'better-auth/api';
import { APIError } from 'better-auth/api';
import type { Auth } from 'better-auth/auth';
import { fromNodeHeaders } from 'better-auth/node';

/**
 * Type representing a valid user session after authentication
 * Excludes null and undefined values from the session return type
 */
export type UserSession = NonNullable<
	Awaited<ReturnType<ReturnType<typeof getSession>>>
>;

/**
 * NestJS guard that handles authentication for protected routes
 * Can be configured with @Public(), @Optional(), @Role(), @Permissions() decorators to modify authentication behavior
 */
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		@Inject(Reflector)
		private readonly reflector: Reflector,
		@Inject(AUTH_INSTANCE_KEY)
		private readonly auth: Auth,
	) {}

	/**
	 * Validates if the current request is authenticated
	 * Attaches session and user information to the request object
	 * @param context - The execution context of the current request
	 * @returns True if the request is authorized to proceed, throws an error otherwise
	 */
	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const session = await this.auth.api.getSession({
			headers: fromNodeHeaders(request.headers),
		});

		request.session = session;
		request.user = session?.user ?? null; // useful for observability tools like Sentry

		const isPublic = this.reflector.get('PUBLIC', context.getHandler());

		if (isPublic) return true;

		const isOptional = this.reflector.get('OPTIONAL', context.getHandler());

		if (isOptional && !session) return true;

		if (!session) {
			throw new APIError(401, {
				code: 'UNAUTHORIZED',
				message: 'Unauthorized',
			});
		}

		// Check for role metadata at both handler and class level
		const handlerRole = this.reflector.get('ROLE', context.getHandler());
		const classRole = this.reflector.get('ROLE', context.getClass());
		const role = handlerRole ?? classRole;
		const userRoles = (session.user as unknown as User).role.split(',');

		if (role && role !== 'any' && !userRoles.includes(role)) {
			throw new APIError(403, {
				code: 'FORBIDDEN',
				message: 'Forbidden',
			});
		}

		const permissions = this.reflector.get('PERMISSIONS', context.getHandler());
		const checkPermissions = Object.keys(permissions ?? {}).length > 0;
		const authWithPermissionsChecker = this.auth.api as unknown as {
			userHasPermission: (input: {
				body: {
					userId: string;
					permissions: Record<string, string[]>;
				};
			}) => Promise<{ success: boolean }>;
		};
		const { success: hasPermission } =
			await authWithPermissionsChecker.userHasPermission({
				body: {
					userId: session.user.id,
					permissions: {
						...permissions,
					},
				},
			});

		if (checkPermissions && !hasPermission) {
			throw new APIError(403, {
				code: 'FORBIDDEN',
				message: 'Forbidden',
			});
		}

		return true;
	}
}
