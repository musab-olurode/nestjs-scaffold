import { Environment } from '@/validation/env.validation';

import { WinstonLoggerService } from '@/logger/winston-logger/winston-logger.service';

import { ac, admin } from '@/app/auth/permissions';
import configuration from '@/config/configuration';
import { CapitalizeTransformer } from '@/utils/transformers/capitalize';

import { createId } from '@paralleldrive/cuid2';
import { betterAuth, Status, type User } from 'better-auth';
import { APIError } from 'better-auth/api';
import {
	admin as adminPlugin,
	createAuthMiddleware,
	customSession,
} from 'better-auth/plugins';
import { Pool } from 'pg';

const isProd = configuration.NODE_ENV === Environment.Production;
const trustedOrigins = configuration.TRUSTED_ORIGINS.split(',');

interface RequestMetadata {
	requestHash: string;
	startTime: number;
}

declare module 'better-auth' {
	interface Context {
		requestMetadata?: RequestMetadata;
	}
}

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
		before: createAuthMiddleware((ctx) => {
			const logger = new WinstonLoggerService();

			logger.setContext('RequestLoggingInterceptor');

			const requestHash = createId();
			const startTime = Date.now();

			// Store request metadata in context for use in after hook
			ctx.context.requestMetadata = {
				requestHash,
				startTime,
			};

			logger.log(`========= [START] HTTP request ${requestHash} =========`);
			logger.log(`HTTP request ${requestHash}`, {
				method: ctx.method,
				url: `${ctx.context.options.basePath ?? ''}${ctx.path}`,
				body: ctx.request?.body ?? '',
				ip: '::',
				query: ctx.query ?? {},
			});

			return Promise.resolve(ctx.context.returned);
		}),
		after: createAuthMiddleware((ctx) => {
			let finalReturned = ctx.context.returned;

			if (ctx.context.returned instanceof APIError) {
				const error: APIError = ctx.context.returned;

				throw new APIError(error.statusCode as Status, {
					message: error.body?.message,
					error: error.body?.code,
					statusCode: error.statusCode,
					code: undefined,
				});
			}

			if (ctx.path === '/sign-in/email' || ctx.path === '/sign-up/email') {
				const returned = {
					...(ctx.context.returned as { user: User }),
				};
				const { name: firstName, ...userWithoutName } = returned.user;

				const modifiedReturned = {
					...returned,
					user: {
						...userWithoutName,
						firstName,
						lastName: ctx.context.newSession?.user.lastName,
						role: ctx.context.newSession?.user.role,
					},
				};

				finalReturned = modifiedReturned;
			}

			const logger = new WinstonLoggerService();

			logger.setContext('RequestLoggingInterceptor');

			const { requestHash, startTime } = ctx.context.requestMetadata ?? {
				requestHash: 'unknown',
				startTime: Date.now(),
			};
			const duration = Date.now() - startTime;

			const sanitizedReturnedForLogging = {
				...(finalReturned as Record<string, unknown>),
			};

			if (sanitizedReturnedForLogging.session) {
				sanitizedReturnedForLogging.session = {
					...sanitizedReturnedForLogging.session,
					token: '********',
				};
			}

			if (sanitizedReturnedForLogging.token) {
				sanitizedReturnedForLogging.token = '********';
			}

			logger.log(
				`HTTP response ${requestHash as string} +${duration.toString()}ms`,
				finalReturned,
			);
			logger.log(
				`========= [END] HTTP request ${requestHash as string} =========`,
			);

			return Promise.resolve(finalReturned);
		}),
	},
	plugins: [
		adminPlugin({
			ac,
			roles: {
				admin,
			},
		}),
		customSession(({ user, session }) => {
			const { name, ...rest } = user;

			return Promise.resolve({
				user: {
					...rest,
					firstName: name,
				},
				session,
			});
		}),
	],
});

export default auth;
