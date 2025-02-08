import {
	CallHandler,
	ExecutionContext,
	HttpException,
	Injectable,
	NestInterceptor,
	RequestTimeoutException,
} from '@nestjs/common';

import { WinstonLoggerService } from '@/logger/winston-logger/winston-logger.service';

import configuration from '@/config/configuration';

import { AxiosError } from 'axios';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		return next.handle().pipe(
			catchError((err) => {
				if (err instanceof AxiosError) {
					return throwError(
						() =>
							new HttpException(
								err.response?.data.message,
								err.response?.status ?? 500,
							),
					);
				} else if (err.message.includes('timeout')) {
					return throwError(
						() => new RequestTimeoutException('Request timed out'),
					);
				}

				const errorStatus = err.status || 500;
				let errorMessage = err.message || err;
				const IS_PRODUCTION = configuration.NODE_ENV === 'production';

				if (errorStatus === 500) {
					if (IS_PRODUCTION) {
						const logger = new WinstonLoggerService();

						logger.setContext('ErrorsInterceptor');
						logger.error(errorMessage, { stack: err.stack });
						errorMessage =
							'Oops! Something went wrong on our end. Please try again later.';
					}
					// eslint-disable-next-line no-console
					console.error(err);
				}

				return throwError(() => new HttpException(errorMessage, errorStatus));
			}),
		);
	}
}
