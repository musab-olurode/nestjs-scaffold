import { validate as validateEnv } from '@/validation/env.validation';

import 'dotenv/config';

const configuration = validateEnv(process.env);

export default configuration;
