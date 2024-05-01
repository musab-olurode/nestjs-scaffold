import { ExecutionContext, HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class TwitterOauthGuard extends AuthGuard('twitter') {
  constructor() {
    super();
  }

  handleRequest<TUser = User>(
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
      throw new HttpException(
        err.message || 'Something went wrong, please try again',
        err.status || 500,
      );
    }
    return user;
  }
}
