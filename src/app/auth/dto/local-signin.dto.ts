import { IsEmail, IsString } from 'class-validator';

export class LocalSigninDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
