// src/organization/organization.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';

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
  
  async updateOrganization(org_id: string, dto: UpdateOrganizationDto): Promise<any> {
    const updateOrg = await this.organizationRepo.findOne({ where: { id: org_id } });
  
    if (!updateOrg) {
      throw new NotFoundException('Organization not found');
    }
  
    // Merge and save
    Object.assign(updateOrg, dto);
    await this.organizationRepo.save(updateOrg);
  
    return {
      success: 'true',
      message: 'Organization Updated',
    };
  }

  async deleteOrganization(org_id: string, user: any) {
    const deleteOrg = await this.organizationRepo.findOne({ where: { id: org_id } });
  
    if (!deleteOrg) {
      throw new NotFoundException('Organization not found');
    }
  
    // Add role-based or ownership check here
    // if (org.owner !== user.userId) {
    //   throw new ForbiddenException('You are not authorized to delete this organization');
    // }
  
    await this.organizationRepo.remove(deleteOrg);
  
    return {
      success: 'true',
      message: 'Organization Deleted',
    };
  }

  async viewOrganization(orgId: string, user: any) {
    const organization = await this.organizationRepo.findOne({ where: { id: orgId } });
  
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
  
    return {
      success: 'true',
      message: 'Organization details fetched successfully',
      data: organization,
    };
  }
  
}
