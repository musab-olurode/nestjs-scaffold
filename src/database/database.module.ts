import { Module } from '@nestjs/common';

import { PostgresDatabaseProviderModule } from '@/database/providers/postgres.provider.module';

@Module({
	imports: [PostgresDatabaseProviderModule],
})
export class DatabaseModule {}
