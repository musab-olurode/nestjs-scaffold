import {
  Body,
  Controller,
  Get,
  HttpCode,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from '../../decorators/public.decorator';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from '../../decorators/user.decorator';
import { User } from '../users/entities/user.entity';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { TwitterOauthGuard } from './guards/twitter-oauth.guard';
import { SignupUserDto } from './dto/signup-user.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  @HttpCode(200)
  signin(@CurrentUser() user: User) {
    return this.authService.signin(user);
  }

  @Public()
  @UseGuards(GoogleOauthGuard)
  @Get('/signin/google')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  googleOauthSignin() {}

  @Public()
  @UseGuards(GoogleOauthGuard)
  @Get('/signin/google/redirect')
  googleOauthRedirect(@CurrentUser() user: User) {
    return this.authService.socialSignin(user);
  }

  @Public()
  @UseGuards(TwitterOauthGuard)
  @Get('/signin/twitter')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  twitterOauthSignin() {}

  @Public()
  @UseGuards(TwitterOauthGuard)
  @Get('/signin/twitter/redirect')
  twitterOauthRedirect(@CurrentUser() user: User) {
    return this.authService.socialSignin(user);
  }

  @Public()
  @Post('signup')
  signup(@Body() signupUserDto: SignupUserDto) {
    return this.authService.signup(signupUserDto);
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @Patch('update-password')
  updatePassword(
    @CurrentUser() user: User,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ) {
    return this.authService.updatePassword(user, updatePasswordDto);
  }

  @Get('me')
  findAuthUser(@CurrentUser() user: User) {
    return this.authService.findAuthUser(user.id);
  }

  @Post('email/send-verification')
  sendEmailVerification(@CurrentUser() user: User) {
    return this.authService.sendEmailVerification(user);
  }

  @Public()
  @Post('email/verify')
  verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyEmailDto.token);
  }

  @Public()
  @Post('refresh')
  refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
