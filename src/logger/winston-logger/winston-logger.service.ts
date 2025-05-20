import { Injectable, LoggerService, Scope } from '@nestjs/common';

import { createLogger, format, transports } from 'winston';

const { combine, timestamp, json } = format;

const logger = createLogger({
	format: combine(timestamp({ format: new Date().toLocaleString() }), json()),
	transports: [new transports.Console()],
});

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLoggerService implements LoggerService {
	context: string;

	setContext(context: string): void {
		this.context = context;
	}

	log(message: string, ...optionalParams: unknown[]) {
		logger.info(`[${this.context}] ${message}`, ...optionalParams);
	}

	error(message: string, ...optionalParams: unknown[]) {
		logger.error(`[${this.context}] ${message}`, ...optionalParams);
	}

	warn(message: string, ...optionalParams: unknown[]) {
		logger.warn(`[${this.context}] ${message}`, ...optionalParams);
	}
}
