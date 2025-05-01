// src/organization/organization.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { User } from 'src/auth/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [TypeOrmModule.forFeature([Organization, User,]),
  AuthModule, // access JwtAuthGuard + UserRepository
],
  providers: [OrganizationService,JwtService],
  controllers: [OrganizationController],
  exports: [OrganizationService],  
})
export class OrganizationModule {}
