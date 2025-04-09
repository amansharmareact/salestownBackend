import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('No token provided');
    }

    try {
      const payload = this.jwtService.verify(token);
      console.log('Payload:', payload);

      const user = await this.userRepository.findOne({
        where: { user_id: payload.sub },
      });
      console.log('User:', user);

      if (!user || user.token !== token) {
        console.log('Token mismatch!');
        throw new UnauthorizedException('Session expired. Login again.');
      }

      request.user = user; // Attach user to request
      return true;
    } catch (error) {
      console.log(error);
      console.log('Token in request:', request.headers.authorization);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
