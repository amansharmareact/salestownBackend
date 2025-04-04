import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './entities/user.entity';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
        secret: process.env.JWT_SECRET || 'your_secret_key', 
        signOptions: { expiresIn: '1d' }, // Token valid for 1 day
      }),
],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}