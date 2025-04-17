import {
  Body,
  Controller,
  Post,
  Get,
  Req,
  UseGuards,
  Patch,
  Param,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { ChangePasswordDto } from './dto/change-password.dto';
import { Roles } from 'src/common/decorators/roles.decorator';
import { TogglePasswordChangeDto } from './dto/toggle-password.dto';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { UserResponseDto } from './dto/create-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
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

  // Only accessible to authenticated users with a valid JWT
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Req() req) {
    const user_id = req.user.user_id;
    return this.authService.getProfile(user_id);
  }

  // Users have access to change theie Password
  @UseGuards(AuthGuard('jwt'))
  @Post('change-password')
  async changePassword(@Req() req, @Body() dto: ChangePasswordDto) {
    return this.authService.changePassword(req.user, dto);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin') // Only admin can access this
  @Patch('toggle-password-change/:user_id')
  async togglePasswordChange(
    @Param('user_id') user_id: string,
    @Body() dto: TogglePasswordChangeDto,
  ) {
    return this.authService.togglePasswordChange(user_id, dto);
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin') // Only allow admin
  @Get('list')
  async getUsersList(@Req() req) {
    const user = req.user;
    return this.authService.getUsersList(user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('delete')
  async deleteAccount(@Req() req) {
    const userId = req.user.user_id;
    return this.authService.deleteAccount(userId);
  }
}
