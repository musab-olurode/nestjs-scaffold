import { plainToInstance, Type } from 'class-transformer';
import {
	IsBoolean,
	IsEmail,
	IsEnum,
	IsInt,
	IsNumber,
	IsString,
	IsUrl,
	Max,
	Min,
	validateSync,
} from 'class-validator';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export enum Environment {
	Development = 'development',
	Production = 'production',
	Test = 'test',
	Provision = 'provision',
}

export class EnvironmentVariables {
	@IsEnum(Environment)
	NODE_ENV: Environment;

	@IsNumber()
	@Min(0)
	@Max(65535)
	PORT: number;

	@IsString()
	APP_URL!: string;

	@IsUrl({ require_tld: false, require_protocol: true })
	CLIENT_URL!: string;

	@IsString()
	BETTER_AUTH_SECRET!: string;

	@IsUrl({ require_tld: false, require_protocol: true })
	BETTER_AUTH_URL!: string;

	@IsString()
	TRUSTED_ORIGINS!: string;

	@IsString()
	CROSS_DOMAIN_ORIGIN: string;

	@IsString()
	TYPEORM_CONNECTION!: PostgresConnectionOptions['type'];

	@IsString()
	TYPEORM_URL!: string;

	@IsBoolean()
	@Type(() => Boolean)
	TYPEORM_SYNCHRONIZE!: boolean;

	@IsString()
	TYPEORM_ENTITIES!: string;

	@IsString()
	TYPEORM_MIGRATIONS!: string;

	@IsString()
	TYPEORM_MIGRATIONS_DIR!: string;

	@IsString()
	TYPEORM_CHARSET!: string;

	@IsString()
	TYPEORM_COLLATION!: string;

	@IsInt()
	@Type(() => Number)
	SECURE_TOKEN_EXPIRY!: number;

	@IsString()
	OAUTH_GOOGLE_CLIENT_ID!: string;

	@IsString()
	OAUTH_GOOGLE_CLIENT_SECRET!: string;

	@IsString()
	OAUTH_TWITTER_CLIENT_ID!: string;

	@IsString()
	OAUTH_TWITTER_CLIENT_SECRET!: string;

	@IsEmail()
	FROM_EMAIL!: string;

	@IsString()
	FROM_NAME!: string;

	@IsString()
	SMTP_HOST!: string;

	@IsInt()
	@Type(() => Number)
	SMTP_PORT!: number;

	@IsString()
	SMTP_EMAIL!: string;

	@IsString()
	SMTP_PASSWORD!: string;

	@IsString()
	CLOUD_NAME!: string;

	@IsString()
	CLOUD_API_KEY!: string;

	@IsString()
	CLOUD_API_SECRET!: string;

	@IsString()
	CLOUDINARY_URL!: string;

	@IsInt()
	@Type(() => Number)
	@Min(1)
	MAX_FILE_UPLOAD_SIZE_IN_BYTES!: number;

	@IsEmail()
	SUPER_ADMIN_EMAIL!: string;

	@IsString()
	SUPER_ADMIN_PASSWORD!: string;
}

export function validate(config: Record<string, unknown>) {
	const validatedConfig = plainToInstance(EnvironmentVariables, config, {
		enableImplicitConversion: true,
	});
	const errors = validateSync(validatedConfig, {
		skipMissingProperties: false,
	});

	if (errors.length > 0) {
		throw new Error(errors.join('\n'));
	}

	return validatedConfig;
}
