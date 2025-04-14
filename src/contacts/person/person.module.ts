// src/contacts/person/person.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { Organization } from '../organization/entities/organization.entity';
import { User } from 'src/auth/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Person, Organization, User]),
  JwtModule.register({}), 
],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [TypeOrmModule],
})
export class PersonModule {}

