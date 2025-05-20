import 'reflect-metadata';
import configuration from '@/config/configuration';

import { DataSource } from 'typeorm';

export const AppDataSource = new DataSource({
	type: configuration.TYPEORM_CONNECTION,
	url: configuration.TYPEORM_URL,
	extra: { charset: configuration.TYPEORM_CHARSET },
	synchronize: configuration.TYPEORM_SYNCHRONIZE,
	migrations: [configuration.TYPEORM_MIGRATIONS],
	entities: [configuration.TYPEORM_ENTITIES],
});
