import {Injectable, UnauthorizedException,BadRequestException,} from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  import { JwtService } from '@nestjs/jwt';
  import { User } from './entities/user.entity';
  import { CreateUserDto } from './dto/create-user.dto';
  import { LoginUserDto } from './dto/login-user.dto';
  import { LoginResponseDto } from './dto/login-response.dto';
  
  @Injectable()   
  export class AuthService {
    constructor(
      @InjectRepository(User)
      private userRepository: Repository<User>,
      private jwtService: JwtService,
    ) {}
  
    async signup(createUserDto: CreateUserDto): Promise<LoginResponseDto> {
      const existingUser = await this.userRepository.findOne({
        where: { email: createUserDto.email },
      });
  
      if (existingUser) {
        throw new BadRequestException('User already exists with this email');
      }
  
      const user = this.userRepository.create({
        ...createUserDto,
        day_left: 30, // Default value
      });
  
      await this.userRepository.save(user);
  
      // Generate JWT Token
      const payload = { sub: user.user_id, email: user.email, role: user.role };
      const token = this.jwtService.sign(payload);
  
      // Store token in the database
      user.token = token;
      await this.userRepository.save(user);
  
      return {
        success: true,
        message: 'User Information',
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
  
    async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
      const { email, password } = loginUserDto;
      const user = await this.userRepository.findOne({ where: { email } });
  
      if (!user || !(await user.validatePassword(password))) {
        throw new UnauthorizedException('Invalid credentials');
      }
  
      // Generate JWT Token
      const payload = { sub: user.user_id, email: user.email, role: user.role };
      const token = this.jwtService.sign(payload);
  
      return {
        success: true,
        message: 'User Information',
        data: {
          user_id: user.user_id,
          company_id: user.company_id,
          company_name: user.companyName,
          name: user.name,
          email: user.email,
          phone: user.phone,
          token: token,
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
  }
  