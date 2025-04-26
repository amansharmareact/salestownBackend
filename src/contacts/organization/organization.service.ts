// src/organization/organization.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { User } from 'src/auth/entities/user.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
  ) {}

  async createOrganization(dto: CreateOrganizationDto, user: any) {
    console.log('HIT');
    const org = this.organizationRepo.create({
      ...dto,
      id: user.user_id,
    });

    const saved = await this.organizationRepo.save(org);

    return {
      success: 'true',
      message: 'Organization added',
      organization_id: saved.id,
    };
  }

  async updateOrganization(
    org_id: string,
    dto: UpdateOrganizationDto,
  ): Promise<any> {
    const updateOrg = await this.organizationRepo.findOne({
      where: { id: org_id },
    });

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
    const deleteOrg = await this.organizationRepo.findOne({
      where: { id: org_id },
    });

    if (!deleteOrg) {
      throw new NotFoundException('Organization not found');
    }

    // Add role-based 
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
    const organization = await this.organizationRepo.findOne({
      where: { id: orgId },
      relations: ['persons'],
    });

    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    const { persons, ...orgData } = organization;

    const filteredPersons = persons.map((person) => ({
      person_id: person.id,
      name: person.person_name,
      email: person.email?.[0] || '',
      phone: person.phone?.[0] || '',
    }));

    return {
      success: 'true',
      message: 'Organization details',
      data: {
        ...orgData,
        owner: user?.name,
        persons: filteredPersons,
      },
    };
  }

  async getOrganizations(filters: any, user: any) {
    const {
      per_page = 10,
      page = 1,
      search,
      user_id,
      start_date,
      end_date,
      country,
      city,
    } = filters;
  
    const take = +per_page;
    const skip = (page - 1) * take;
  
    const query = this.organizationRepo
      .createQueryBuilder('org')
      .leftJoinAndSelect('org.persons', 'person');
  
    // Search filter
    if (search) {
      query.andWhere(
        `(org.organization_name ILIKE :search OR org.country ILIKE :search OR org.city ILIKE :search)`,
        { search: `%${search}%` },
      );
    }
  
    // Filter by owner (user_id)
    if (user_id) {
      query.andWhere('org.ownerId = :user_id', { user_id });
    }
  
    // Date range filter
    if (start_date) {
      query.andWhere('org.created_at >= :start_date', { start_date });
    }
  
    if (end_date) {
      query.andWhere('org.created_at <= :end_date', { end_date });
    }
  
    // Country / city filter
    if (country) {
      query.andWhere('org.country = :country', { country });
    }
  
    if (city) {
      query.andWhere('org.city = :city', { city });
    }
  
    // Pagination
    const [orgs, total] = await query
      .skip(skip)
      .take(take)
      .orderBy('org.created_at', 'DESC')
      .getManyAndCount();
  
    const responseData = orgs.map((org) => ({
      org_id: org.id,
      name: org.organization_name,
      address: org.address || null,
      total_persons: org.persons.length,
      persons: org.persons.map((p) => ({
        person_id: p.id,
        name: p.person_name,
        email: p.email,
        phone: p.phone,
      })),
    }));
  
    return {
      success: 'true',
      message: 'Organization data',
      per_page: take,
      page,
      details: {
        is_prev: page > 1,
        is_next: skip + take < total,
        total_data: total,
        start: skip + 1,
        end: Math.min(skip + take, total),
      },
      data: responseData,
    };
  }


   //Get Organization's City Names 
  async getOrganizationCities(search?:string){
    const query = this.organizationRepo
    .createQueryBuilder('organization')
    .select('DISTINCT organization.city', 'city')
    .where('organization.city IS NOT NULL');

    if(search) {
      query.andWhere('LOWER(organization.city) LIKE :search',{
        search: `%${search.toLowerCase()}%`,
      });
    }

    const cities = await query.orderBy('organization.city', 'ASC').getRawMany();

    return {
      success: 'true',
      message: 'Cities List Fetched',
      data: cities
    }
  }

  //Organizations Search
  async searchOrganizations({per_page, page, search }) {
    const skip = (page - 1)*per_page;

    const query = this.organizationRepo
    .createQueryBuilder('org')
    .where("LOWER(org.organization_name) LIKE :search", { search: `%${search}%` })
    .orderBy("org.organization_name", "ASC")
    .skip(skip)
    .take(per_page);

  const [result , total] = await query.getManyAndCount();

  const searched = result.map((org) => ({
    org_id: org.id,
    name: org.organization_name,
    country: org.country,
    state: org.state,
    city: org.city,
    pincode: org.pincode,
    address: org.address,
    address_line_2: org.address_line_2,
  }))

  return {
    success: 'true',
    message: 'Organization List Fetched',
    info: {
      per_page: per_page,
      page,
      total,
      is_next: page * per_page < total,
    },
    data: searched,
  }
  }
  
  

}
