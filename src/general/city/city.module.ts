
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { CityService } from './city.service';
import { CityController } from './city.controller';
import { State } from '../state/entities/state.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([City, State,User]),JwtModule.register({})],
  providers: [CityService],
  controllers: [CityController],
})
export class CityModule {}
