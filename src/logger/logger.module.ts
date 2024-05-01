import { Module } from '@nestjs/common';
import { WinstonLoggerService } from './winston-logger/winston-logger.service';

@Module({
  providers: [WinstonLoggerService],
  exports: [WinstonLoggerService],
})
export class LoggerModule {}
