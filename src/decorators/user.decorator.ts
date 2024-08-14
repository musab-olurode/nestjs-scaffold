import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../app/users/entities/user.entity';

// Decorator to access the payload from a validated access token.
// It should be used only in the arguments for methods in your presentation layer.
export const CurrentUser = createParamDecorator(
	(data: unknown, context: ExecutionContext) => {
		const req = context.switchToHttp().getRequest();
		return req.user as User;
	},
);
