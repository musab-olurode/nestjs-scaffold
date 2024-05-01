import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { PostgresDatabaseProviderModule } from '../providers/postgres.provider.module';
import { UsersSeederModule } from './users/users.seeder.module';

@Module({
  imports: [PostgresDatabaseProviderModule, UsersSeederModule],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}
