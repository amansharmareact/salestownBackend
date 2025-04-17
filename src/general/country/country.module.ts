import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from './entities/country.entity';
import { CountryService } from './country.service';
import { CountryController } from './country.controller';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/auth/entities/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Country,User]), JwtModule.register({}), ], 
  controllers: [CountryController],
  providers: [CountryService],
  exports: [CountryService],
})
export class CountryModule {}

