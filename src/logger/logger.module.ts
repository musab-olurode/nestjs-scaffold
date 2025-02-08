import { Module } from '@nestjs/common';

import { WinstonLoggerService } from '@/logger/winston-logger/winston-logger.service';

@Module({
	providers: [WinstonLoggerService],
	exports: [WinstonLoggerService],
})
export class LoggerModule {}
