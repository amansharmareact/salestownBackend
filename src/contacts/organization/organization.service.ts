// src/organization/organization.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
  ) {}

  async createOrganization(dto: CreateOrganizationDto, user: any) { 
    console.log("HIT")
    const org = this.organizationRepo.create({
        ...dto,
         id: user.user_id, // or user.id depending on your user object
      });
      
    const saved = await this.organizationRepo.save(org);

    return {
      success: 'true',
      message: 'Organization added',
      organization_id: saved.id,
    };
  }
}
