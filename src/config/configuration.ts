import { validate as validateEnv } from '@/validation/env.validation';

import * as dotenv from 'dotenv';
import * as dotenvExpand from 'dotenv-expand';

dotenvExpand.expand(dotenv.config());

const configuration = validateEnv(process.env);

export default configuration;
