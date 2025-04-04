import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
  ): Promise<LoginResponseDto> {
    return this.authService.signup(createUserDto);
  }

  @Post('login')
  async login(@Body() loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    return this.authService.login(loginUserDto);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Req() req) {
    return this.authService.logout(req.user.user_id);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    return this.authService.forgotPassword(email);
  }

  @Post('verify-otp')
  async verifyOtp(@Body('email') email: string, @Body('otp') otp: string) {
    return this.authService.verifyOtp(email, otp);
  }

  @Post('resend-otp')
  async resendOtp(@Body('email') email: string) {
    return this.authService.resendOtp(email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('confirm_password') confirm_password: string,
  ) {
    return this.authService.resetPassword(email, password, confirm_password);
  }
}
