import { IsMatch } from '@/decorators/match.decorator';

import { IsString } from 'class-validator';

export class UpdatePasswordDto {
	@IsString()
	oldPassword: string;

	@IsString()
	password: string;

	@IsString()
	@IsMatch(UpdatePasswordDto, (updatePasswordDto) => updatePasswordDto.password)
	confirmPassword: string;
}
