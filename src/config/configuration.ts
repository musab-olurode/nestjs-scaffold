import { EnvironmentVariables } from '../validation/env.validation';
import { plainToInstance } from 'class-transformer';
import 'dotenv/config';

const config = () =>
	plainToInstance(EnvironmentVariables, process.env, {
		enableImplicitConversion: true,
	});

const configuration = config();

export default configuration;
