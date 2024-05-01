import { IsString } from 'class-validator';
import { IsMatch } from 'src/decorators/match.decorator';

export class UpdatePasswordDto {
  @IsString()
  oldPassword: string;

  @IsString()
  password: string;

  @IsString()
  @IsMatch(UpdatePasswordDto, (updatePasswordDto) => updatePasswordDto.password)
  confirmPassword: string;
}
