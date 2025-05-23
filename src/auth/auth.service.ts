import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as nodemailer from 'nodemailer';
import * as bcrypt from 'bcrypt';
import { TogglePasswordChangeDto } from './dto/toggle-password.dto';
import { UserResponseDto } from './dto/create-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(createUserDto: CreateUserDto, req?: any): Promise<UserResponseDto> {
  const { email, role } = createUserDto;

  const existingUser = await this.userRepository.findOne({ where: { email } });
  if (existingUser) {
    throw new BadRequestException('User already exists with this email');
  }

  let company_id: string = createUserDto.company_id;
  let companyName: string = createUserDto.companyName;

  // If role is 'user', check for admin token
  if (role === 'user') {
    const authHeader = req?.headers?.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Admin token required for user signup');
    }

    const token = authHeader.split(' ')[1];
    let payload;

    try {
      payload = this.jwtService.verify(token);
    } catch (err) {
      throw new UnauthorizedException('Invalid admin token');
    }

    const admin = await this.userRepository.findOne({ where: { user_id: payload.sub } });

    if (!admin || admin.role !== 'admin') {
      throw new ForbiddenException('Only admin can create users');
    }

    company_id = admin.company_id;
    companyName = admin.companyName;
  }

  // ✅ Create user with appropriate company_id
  const user = this.userRepository.create({
    ...createUserDto,
    company_id,
    companyName,
    day_left: 30,
  });

  await this.userRepository.save(user);

  return {
    success: true,
    message: 'User Information Registered',
    data: {
      user_id: user.user_id,
      company_id: user.company_id,
      company_name: user.companyName,
      name: user.name,
      email: user.email,
      phone: user.phone,
      customer_id: user.customer_id,
      role: user.role,
      day_left: user.day_left,
      image: user.image,
      currency_id: user.currency_id,
      currency_icon: '<i class="fa fa-usd"></i>',
      currency_unicode: '&#36;',
      currency_name: user.currencyName,
    },
  };
}


  async login(loginUserDto: LoginUserDto): Promise<any> {
    const { email, password } = loginUserDto;

    // 🔍 Find user by email
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user || !(await user.validatePassword(password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Invalidate previous session by replacing the token
    const payload = { sub: user.user_id, email: user.email, role: user.role, };
    const newToken = this.jwtService.sign(payload, { expiresIn: '1d' });

    user.token = newToken; // Update stored token
    await this.userRepository.save(user); // Save the updated user with new token

    // Return
    return {
      success: true,
      message: 'User Information Logged In',
      data: {
        user_id: user.user_id,
        company_id: user.company_id,
        company_name: user.companyName,
        name: user.name,
        email: user.email,
        phone: user.phone,
        token: user.token,
        customer_id: user.customer_id,
        role: user.role,
        day_left: user.day_left,
        image: user.image,
        currency_id: user.currency_id,
        currency_icon: '<i class="fa fa-usd"></i>',
        currency_unicode: '&#36;',
        currency_name: user.currencyName,
      },
    };
  }


  async logout(userId: string): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findOne({
      where: { user_id: userId },
    });

    if (!user) throw new NotFoundException('User not found');

    user.token = null; // Clear the token from the database
    await this.userRepository.save(user);

    return { success: true, message: 'Logged out successfully' };
  }

  // FORGOT PassWord API
  async forgotPassword(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      throw new NotFoundException('User with this email doest not exist');
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates 6-digit OTP

    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 10); // OTP valid for 10  minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await this.userRepository.save(user);

    //Send OTP via email
    await this.sendOtpEmail(user.email, otp);

    return {
      success: true,
      message: 'OTP has been sent on Email',
    };
  }

  private async sendOtpEmail(email: string, otp: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_APP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
  }

  //Verify OTP API

  async verifyOtp(
    email: string,
    otp: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException('User not found');

    if (!user.otp || !user.otpExpiry) {
      throw new BadRequestException('No OTP found, please request again');
    }

    const now = new Date();

    if (user.otp !== otp) {
      throw new BadRequestException('Invalid OTP');
    }

    if (now > user.otpExpiry) {
      throw new BadRequestException('OTP has expired, please request again');
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpiry = null;
    await this.userRepository.save(user);

    return {
      success: true,
      message: 'OTP verified successfully',
    };
  }

  // Resend OTP API

  async resendOtp(
    email: string,
  ): Promise<{ success: boolean; message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });

    if (!user) throw new NotFoundException('User not found');

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generates 6-digit OTP
    const otpExpiry = new Date();
    otpExpiry.setMinutes(otpExpiry.getMinutes() + 5); // OTP valid for 5 minutes

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await this.userRepository.save(user);

    // Send OTP via email
    await this.sendEmail(user.email, otp);

    return {
      success: true,
      message: 'OTP has been sent on mail',
    };
  }

  private async sendEmail(email: string, otp: string) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.SENDER_APP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: 'Resend OTP Request',
      text: `Your new OTP is: ${otp}. It is valid for 5 minutes.`,
    };

    await transporter.sendMail(mailOptions);
  }

  //Reset Password API
  async resetPassword(
    email: string,
    password: string,
    confirm_password: string,
  ): Promise<{ success: boolean; message: string }> {
    if (password !== confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Invalild User');
    }

    // Hash the new Password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;

    // Clear OTP fields after reset
    user.otp = null as any;
    user.otpExpiry = null as any;

    await this.userRepository.save(user);

    return {
      success: true,
      message: 'Password Changed Successfully',
    };
  }

  // GEt PRofile
  async getProfile(user_id: string) {
    const user = await this.userRepository.findOne({
      where: { user_id },
    });
  
    if (!user) throw new NotFoundException('User not found');
  
    return {
      success: true,
      message: 'User Profile',
      data: {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        company_id: user.company_id,
        company_name: user.companyName,
        customer_id: user.customer_id,
        timezone: user.timezone || "Pacific/Auckland",
        financial_year: user.financial_year || "1 April - 31 March",
        role_id: user.role_id || 1,
        role: user.role,
        day_left: user.day_left,
        image: user.image,
        currency_id: user.currency_id,
        currency_icon: user.currency_icon,
        currency_unicode: user.currency_unicode,
        currency_name: user.currency_name,
        can_change_password: "true",
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    };
  }
  

  // Users Can Change their password
  async changePassword(user: any, dto: ChangePasswordDto) {
    const currentUser = await this.userRepository.findOne({ where: { user_id: user.user_id } });
  
    if (!currentUser) {
      throw new UnauthorizedException('User not found');
    }
  
    if (!currentUser.can_change_password) {
      throw new ForbiddenException('Password change is disabled for this user');
    }
  
    const isMatch = await currentUser.validatePassword(dto.old_password);
    if (!isMatch) {
      throw new BadRequestException('Old password is incorrect');
    }
  
    if (dto.password !== dto.confirm_password) {
      throw new BadRequestException('Passwords do not match');
    }
  
    currentUser.password = await bcrypt.hash(dto.password, 10);
    await this.userRepository.save(currentUser);
  
    return {
      success: 'true',
      message: 'Password changed successfully',
    };
  }

  // An admin-only API to enable/disable a user’s ability to change their password by 
  // updating the can_change_password field in the database.
  async togglePasswordChange(user_id: string, dto: TogglePasswordChangeDto) {
    const user = await this.userRepository.findOne({ where: { user_id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  
    user.can_change_password = dto.can_change_password;
    await this.userRepository.save(user);
  
    return {
      success: 'true',
      message: 'Password change permission updated',
    };
  }

  async getUsersList(user: any) {
    if (user.role !== 'admin') {
      throw new ForbiddenException('Only company admin can view users');
    }
  
    const users = await this.userRepository.find({
      where: { company_id: user.company_id , is_deleted: false,},
      select: ['user_id', 'name'], // Only return necessary fields
    });
  
    return {
      success: 'true',
      message: 'Users List Fetched',
      data: users,
    };
  }
  
  async deleteAccount(userId: string) {
    const user = await this.userRepository.findOne({ where: { user_id: userId, is_deleted: false  }});
  
    if (!user) {
      throw new NotFoundException('User not found or already deleted');
    }
    
    //Hard Delete
    //await this.userRepository.remove(user);

    //Soft Delete
    user.is_deleted = true;
     await this.userRepository.save(user);
  
    return {
      success: "true",
      message: "Account Deleted Successfully"
    };
  }
  
  
}
