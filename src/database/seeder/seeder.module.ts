import { Module } from '@nestjs/common';

import { PostgresDatabaseProviderModule } from '@/database/providers/postgres.provider.module';
import { UsersSeederModule } from '@/database/seeder/users/users.seeder.module';

import { SeederService } from '@/database/seeder/seeder.service';

@Module({
	imports: [PostgresDatabaseProviderModule, UsersSeederModule],
	providers: [SeederService],
	exports: [SeederService],
})
export class SeederModule {}
