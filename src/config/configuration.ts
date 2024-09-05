import { EnvironmentVariables } from '../validation/env.validation';
import { plainToInstance } from 'class-transformer';
import { config as envConfig } from 'dotenv';

envConfig();

const config = () =>
	plainToInstance(EnvironmentVariables, process.env, {
		enableImplicitConversion: true,
	});

const configuration = config();

export default configuration;
