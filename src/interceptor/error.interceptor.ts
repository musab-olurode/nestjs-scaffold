import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  RequestTimeoutException,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AxiosError } from 'axios';
import configuration from '../config/configuration';
import { WinstonLoggerService } from '../logger/winston-logger/winston-logger.service';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof AxiosError) {
          return throwError(
            () =>
              new HttpException(
                err.response?.data.message,
                err.response?.status,
              ),
          );
        } else if (err.message.includes('timeout')) {
          return throwError(
            () => new RequestTimeoutException('Request timed out'),
          );
        }

        const errorStatus = err.status || 500;
        let errorMessage = err.message || err;
        const IS_PRODUCTION = configuration().nodeEnv === 'production';

        if (errorStatus === 500) {
          if (IS_PRODUCTION) {
            const logger = new WinstonLoggerService();
            logger.setContext('ErrorsInterceptor');
            logger.error(errorMessage, { stack: err.stack });
            errorMessage =
              'Oops! Something went wrong on our end. Please try again later.';
          }
          console.error(err);
        }

        return throwError(() => new HttpException(errorMessage, errorStatus));
      }),
    );
  }
}
