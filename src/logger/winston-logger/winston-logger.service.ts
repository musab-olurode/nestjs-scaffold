import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { createLogger, format, transports } from 'winston';

const { combine, timestamp, prettyPrint } = format;

const logger = createLogger({
  format: combine(
    timestamp({ format: new Date().toLocaleString() }),
    prettyPrint(),
  ),
  transports: [new transports.Console()],
});

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLoggerService implements LoggerService {
  context: string;

  setContext(context: string): void {
    this.context = context;
  }

  log(message: any, ...optionalParams: any[]) {
    logger.info(`[${this.context}] ${message}`, ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    logger.error(`[${this.context}] ${message}`, ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    logger.warn(`[${this.context}] ${message}`, ...optionalParams);
  }
}
