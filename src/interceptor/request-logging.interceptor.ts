import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from '@nestjs/common';

import { WinstonLoggerService } from '@/logger/winston-logger/winston-logger.service';

import { createId } from '@paralleldrive/cuid2';
import { Request } from 'express';
import { Observable, tap } from 'rxjs';

@Injectable()
export class RequestLoggingInterceptor implements NestInterceptor {
	constructor(private readonly logger: WinstonLoggerService) {
		this.logger.setContext(RequestLoggingInterceptor.name);
	}

	intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
		if (context.getType() === 'http') {
			// Do something that is only important in the context of regular HTTP requests (REST)
			const req = context.switchToHttp().getRequest();

			return this.handleHTTPRequest(req, next);
		}

		return next.handle();
	}

	handleHTTPRequest(req: Request, next: CallHandler): Observable<unknown> {
		const now = Date.now();

		const { method, url, body, ip, query } = req;

		const requestHash = createId();

		this.logger.log(`========= [START] HTTP request ${requestHash} =========`);
		this.logger.log(`HTTP request ${requestHash}`, {
			method,
			url,
			body,
			ip,
			query,
		});

		return next.handle().pipe(
			tap({
				next: (responseBody) => {
					const duration = Date.now() - now;

					this.logger.log(
						`HTTP response ${requestHash} +${duration.toString()}ms`,
						responseBody,
					);
					this.logger.log(
						`========= [END] HTTP request ${requestHash} =========`,
					);
				},
			}),
		);
	}
}
