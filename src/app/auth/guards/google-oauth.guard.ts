import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
  constructor() {
    super();
  }

  handleRequest<TUser = any>(
    err: any,
    user: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    info: any,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    context: ExecutionContext,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    status?: any,
  ): TUser {
    if (err || !user) {
      let errorStatus = 500;
      if (err.code) {
        switch (err.message) {
          case 'Bad Request':
            errorStatus = 400;
            break;
          default:
            errorStatus = 500;
            break;
        }
      }
      throw new HttpException(
        err.message || 'Something went wrong, please try again',
        errorStatus,
      );
    }
    return user;
  }
}
