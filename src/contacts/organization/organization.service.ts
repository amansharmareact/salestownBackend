// src/organization/organization.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Organization } from './entities/organization.entity';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { User } from 'src/auth/entities/user.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { GetOrganizationActivityDto } from './dto/get-org-activity.dto';
import { Lead } from 'src/leads/entities/lead.entity';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(Organization)
    private readonly organizationRepo: Repository<Organization>,
    @InjectRepository(Activity)
  private readonly activityRepository: Repository<Activity>,
  @InjectRepository(Lead)
  private readonly leadRepository: Repository<Lead>,
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

  // organization.service.ts
async updateOrganization(orgId: string, dto: UpdateOrganizationDto) {
  const organization = await this.organizationRepo.findOne({ where: { id: orgId } });

  if (!organization) {
    throw new NotFoundException('Organization not found');
  }

  Object.assign(organization, dto);

  await this.organizationRepo.save(organization);

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
  async searchOrganizations(search: string, perPage: number, page: number) {
    // Calculate the offset for pagination
    const skip = (page - 1) * perPage;

    // Query the database to search for organizations matching the name
    const [organizations, total] = await this.organizationRepo.findAndCount({
      where: {
        organization_name: search ? Like(`%${search}%`) : undefined, // Using LIKE for name search
      },
      take: perPage,
      skip: skip,
    });

    return {
      success: 'true',
      message: 'Organization List Fetched',
      info: {
        per_page: perPage,
        page,
        total,
        is_next: skip + perPage < total, // Check if there's a next page
      },
      data: organizations.map((org) => ({
        org_id: org.id, // Assuming the id column is 'id' in the entity
        name: org.organization_name,
        country: org.country,
        state: org.state,
        city: org.city,
        pincode: org.pincode,
        address: org.address,
        address_line_2: org.address_line_2,
      })),
    };
  }
  

  //ORg Activity
  // organization.service.ts
async getOrganizationActivity(orgId: string, query: GetOrganizationActivityDto) {
  const perPage = Number(query.per_page) || 10;
  const page = Number(query.page) || 1;

  const [activities, total] = await this.activityRepository.findAndCount({
    where: {
      organization: { id: orgId },
    },
    relations: ['purpose'],
    order: { date: 'DESC', from_time: 'DESC' },
    skip: (page - 1) * perPage,
    take: perPage,
  });

  const data = activities.map((activity) => ({
    activity_id: activity.acitivity_id,
    purpose_id: activity.purpose?.id,
    purpose: activity.purpose?.purpose || '',
    icon: activity.purpose?.icon || '',
    activity_title: activity.activity_title || '',
    activity_note: activity.activity_note || '',
    activity_date: activity.date,
    activity_time: activity.from_time,
    activity_end_time: activity.to_time,
    activity_status: activity.mark_done,
    report: activity.report || null,
    is_assign: 0, // Assuming static
    activity_timestamp: Math.floor(new Date(`${activity.date}T${activity.from_time}`).getTime() / 1000).toString(),
    created_at: activity.created_at.toISOString().replace('T', ' ').split('.')[0],
    created_time: Math.floor(activity.created_at.getTime() / 1000),
    completed_at: activity.completed_at
      ? activity.completed_at.toISOString().replace('T', ' ').split('.')[0]
      : null,
  }));

  return {
    success: 'true',
    message: "Oragnization's Activity Found",
    info: {
      per_page: perPage,
      page: page,
      total_activity: total,
      is_next: total > page * perPage,
    },
    data,
  };
}

async getOrganizationLeads(orgId: string, page: number, perPage: number, user: User) {
  const [leads, total] = await this.leadRepository.findAndCount({
    where: { organization_id: orgId },
    relations: ['person', 'pipeline', 'pipelineStage', 'organization', 'created_by'],
    skip: (page - 1) * perPage,
    take: perPage,
    order: { created_at: 'DESC' },
  });

  const data = leads.map((lead) => ({
    lead_id: lead.lead_id,
    title: lead.title,
    pipeline_id: lead.pipeline_id,
    pipestage: lead.pipestage_id,
    pipestage_total: 5, // we can query actual stage count if needed
    value: lead.value,
    organization_name: lead.organization?.name || '',
    person_name: lead.person?.name || '',
    tag_name: lead.tag_name || null,
    tag_color: lead.tag_color || null,
    tag_color_code: lead.tag_color_code || null,
    salesperson: lead.created_by?.name || '', 
    lead_activity_flag: lead.lead_activity_flag || '',
  }));

  return {
    success: 'true',
    message: "Oragnization's Leads Found",
    info: {
      per_page: perPage,
      page,
      total_leads: total,
      is_next: page * perPage < total,
    },
    data,
  };
}



  
}

{/***
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
  } */}
