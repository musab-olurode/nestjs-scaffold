import { IsString } from 'class-validator';
import { IsMatch } from 'src/decorators/match.decorator';

export class ResetPasswordDto {
  @IsString()
  token: string;

  @IsString()
  password: string;

  @IsString()
  @IsMatch(ResetPasswordDto, (resetPasswordDto) => resetPasswordDto.password)
  confirmPassword: string;
}
