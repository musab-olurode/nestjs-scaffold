import { HttpException, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google') {
	constructor() {
		super();
	}

	handleRequest<TUser = unknown>(
		err: { code: string; message: string } | undefined,
		user: TUser,
	): TUser {
		if (err || !user) {
			let errorStatus = 500;
			let errorMessage = 'Something went wrong, please try again';

			if (err) {
				errorMessage = err.message;
				switch (err.message) {
					case 'Bad Request':
						errorStatus = 400;
						break;
					default:
						errorStatus = 500;
						break;
				}
			}
			throw new HttpException(errorMessage, errorStatus);
		}

		return user;
	}
}
