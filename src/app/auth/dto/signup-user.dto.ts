import { IsEmail, IsString } from 'class-validator';
import { IsMatch } from '../../../decorators/match.decorator';

export class SignupUserDto {
	@IsEmail()
	email: string;

	@IsString()
	firstName: string;

	@IsString()
	lastName: string;

	@IsString()
	password: string;

	@IsString()
	@IsMatch(SignupUserDto, (signupUserDto) => signupUserDto.password)
	confirmPassword: string;
}
