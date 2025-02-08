import { HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class TwitterOauthGuard extends AuthGuard('twitter') {
	constructor() {
		super();
	}

	handleRequest<TUser = unknown>(
		err: { message: string; status: number } | undefined,
		user: TUser,
	): TUser {
		if (err || !user) {
			let errorStatus = 500;
			let errorMessage = 'Something went wrong, please try again';

			if (err) {
				errorStatus = err.status;
				errorMessage = err.message;
			}

			throw new HttpException(errorMessage, errorStatus);
		}

		return user;
	}
}
