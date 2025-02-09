import 'reflect-metadata';
import configuration from '@/config/configuration';

import { DataSource } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export const AppDataSource = new DataSource({
	type: configuration.TYPEORM_CONNECTION,
	host: configuration.TYPEORM_HOST,
	port: configuration.TYPEORM_PORT,
	username: configuration.TYPEORM_USERNAME,
	password: configuration.TYPEORM_PASSWORD,
	extra: { charset: configuration.TYPEORM_CHARSET },
	synchronize: configuration.TYPEORM_SYNCHRONIZE,
	database: configuration.TYPEORM_DATABASE,
	migrations: [configuration.TYPEORM_MIGRATIONS],
	entities: [configuration.TYPEORM_ENTITIES],
	namingStrategy: new SnakeNamingStrategy(),
});
