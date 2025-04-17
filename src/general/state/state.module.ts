import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { State } from './entities/state.entity';
import { StateService } from './state.service';
import { StateController } from './state.controller';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([State, User]),JwtModule.register({})],
  providers: [StateService],
  controllers: [StateController],
})
export class StateModule {}
