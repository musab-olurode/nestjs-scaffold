import { Environment } from '@/validation/env.validation';

import configuration from '@/config/configuration';
import { CapitalizeTransformer } from '@/utils/transformers/capitalize';

import { betterAuth, Status, type User } from 'better-auth';
import { APIError } from 'better-auth/api';
import { admin, createAuthMiddleware } from 'better-auth/plugins';
import { Pool } from 'pg';

const isProd = configuration.NODE_ENV === Environment.Production;
const trustedOrigins = configuration.TRUSTED_ORIGINS.split(',');

const auth = betterAuth({
	basePath: '/v1/auth',
	trustedOrigins,
	database: new Pool({
		connectionString: configuration.TYPEORM_URL,
	}),
	emailAndPassword: {
		enabled: true,
	},
	user: {
		fields: {
			name: 'firstName',
		},
		additionalFields: {
			role: {
				type: 'string',
				required: false,
				defaultValue: 'user',
				input: false,
				returned: true,
			},
			lastName: {
				type: 'string',
				returned: true,
			},
		},
	},
	databaseHooks: {
		user: {
			create: {
				before: (user: User & { lastName: string }) => {
					const capitalize = new CapitalizeTransformer();

					return Promise.resolve({
						data: {
							...user,
							name: capitalize.to(user.name),
							lastName: capitalize.to(user.lastName),
						},
					});
				},
			},
		},
	},
	socialProviders: {
		google: {
			clientId: configuration.OAUTH_GOOGLE_CLIENT_ID,
			clientSecret: configuration.OAUTH_GOOGLE_CLIENT_SECRET,
		},
		twitter: {
			clientId: configuration.OAUTH_TWITTER_CLIENT_ID,
			clientSecret: configuration.OAUTH_TWITTER_CLIENT_SECRET,
		},
	},
	advanced: {
		// cross domain cookies
		...(isProd
			? {
					crossSubDomainCookies: {
						enabled: true,
						domain: configuration.CROSS_DOMAIN_ORIGIN, // Domain with a leading period
					},
					defaultCookieAttributes: {
						secure: true,
						httpOnly: true,
						sameSite: 'none', // Allows CORS-based cookie sharing across subdomains
						partitioned: true, // New browser standards will mandate this for foreign cookies
					},
				}
			: {}),
		database: {
			generateId: false,
		},
	},
	hooks: {
		after: createAuthMiddleware((ctx) => {
			if (ctx.context.returned instanceof APIError) {
				const error: APIError = ctx.context.returned;

				throw new APIError(error.statusCode as Status, {
					message: error.body?.message,
					error: error.body?.code,
					statusCode: error.statusCode,
					code: undefined,
				});
			}

			return Promise.resolve(ctx.context.returned);
		}),
	},
	plugins: [admin()],
});

export default auth;
