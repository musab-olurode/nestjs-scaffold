import { IsMatch } from '@/decorators/match.decorator';

import { IsString } from 'class-validator';

export class ResetPasswordDto {
	@IsString()
	token: string;

	@IsString()
	password: string;

	@IsString()
	@IsMatch(ResetPasswordDto, (resetPasswordDto) => resetPasswordDto.password)
	confirmPassword: string;
}
