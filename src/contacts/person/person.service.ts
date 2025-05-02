// src/contacts/person/person.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { Organization } from '../organization/entities/organization.entity';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Lead } from 'src/leads/entities/lead.entity';
import { User } from 'src/auth/entities/user.entity';
import { GetPersonActivityDto } from './dto/get-org-leads.dto';
import { Activity } from 'src/activity/entities/activity.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepo: Repository<Person>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
     @InjectRepository(Activity)
      private readonly activityRepository: Repository<Activity>,
  ) {}

  // ADD PERSON
  async addPerson(dto: CreatePersonDto) {
    const org = await this.orgRepo.findOne({
         where: { id: dto.organization_id } });
    if (!org) throw new NotFoundException('Organization not found');

    const person = this.personRepo.create({
      ...dto,
      organization: org,
    });

    const saved = await this.personRepo.save(person);

    return {
      success: 'true',
      message: `Person added in ${org.organization_name}`,
      person_id: saved.id,
      organization_id: org.id,
    };
  }

  //VIEW PERSON
async viewPerson(params: any, user: any) {
    const personId = params.person_id || params.personId || params.id;
  
    if (!personId) {
      throw new BadRequestException('person_id is required');
    }
  
    const person = await this.personRepo.findOne({
      where: { id: personId },
      relations: ['organization'], 
    });
  
    if (!person) {
      throw new NotFoundException('Person not found');
    }
  
    return {
      success: 'true',
      message: 'Person details  ',
      data: {
        id: person.id,
        person_name: person.person_name,
        email: person.email,
        phone: person.phone,
        department: person.department,
        designation: person.designation,
        owner: user.name,
        organization_name: person.organization.organization_name,
        custom_column: [],
        first_order: "", 
        last_order: "",  
      }
    }
  }

  //Update Person
  async updatePerson(id:string, dto:UpdatePersonDto){
    try {
      const person = await this.personRepo.findOne({ where: {id}  });
      if(!person){
        throw new NotFoundException("Person Not found");
      }

      const updated = this.personRepo.merge(person, dto);
      await this.personRepo.save(updated);

      return{
        success: 'true',
        message: 'Person Updated',
      }

    } catch (error) {
      console.error("Error Updating person:", error);

      if(error instanceof NotFoundException){
          throw error;
      }

      throw new InternalServerErrorException("Something went wrong while updating the person")
      
    } 
  } 
//Delete PErson
  async deletePerson(id:string){
    try {
      const person = await this.personRepo.find({where: {id}});
      if(!person){
        throw new NotFoundException("Person Not found");
      }

     await this.personRepo.remove(person )

     return {
      success: 'true',
      message: 'Person Deleted',
    };

    } catch (error) {
      console.error('Delete Person Error:', error);
      throw new InternalServerErrorException('Failed to delete person');
      
    }
  }

  //List ALL Persons
async listAllPersons(filters: {
  per_page: number,
  page: number,
  search?: string,
  user_id?: number,
  start_date?: string,
  end_date?: string
}) {
  const { per_page, page, search, user_id, start_date, end_date } = filters;
  const skip = (page - 1) * per_page;

  const query = this.personRepo
    .createQueryBuilder('person')
    .leftJoinAndSelect('person.organization', 'organization')
    .orderBy('person.id', 'DESC');

  if (search) {
    query.andWhere(
      '(LOWER(person.name) LIKE :search OR LOWER(person.email) LIKE :search OR person.phone LIKE :search)',
      { search: `%${search.toLowerCase()}%` }
    );
  }

  if (user_id) {
    query.andWhere('person.created_by = :user_id', { user_id });
  }

  if (start_date) {
    query.andWhere('person.created_at >= :start_date', { start_date });
  }

  if (end_date) {
    query.andWhere('person.created_at <= :end_date', { end_date });
  }

  const [persons, total] = await query.skip(skip).take(per_page).getManyAndCount();

  const data = persons.map((person) => ({
    person_id: person.id,
    person_name: person.person_name || '',
    email: person.email || '',
    phone: person.phone || '',
    organization_name: person.organization?.organization_name || 'no organization',
  }));

  return {
    success: 'true',
    message: 'Persons data',
    per_page,
    page,
    details: {
      is_prev: page > 1,
      is_next: page * per_page < total,
      total_data: total,
      start: skip + 1,
      end: skip + data.length,
    },
    data,
  };
}

//Serach Person 
async searchPersons(
  page: number,
  perPage: number,
  search?: string,
  organizationId?: string
) {
  const query = this.personRepo
    .createQueryBuilder('person')
    .leftJoinAndSelect('person.organization', 'organization');

  if (search) {
    query.andWhere('organization.name ILIKE :search', { search: `%${search}%` });
  }

  if (organizationId) {
    query.andWhere('person.organization_id = :orgId', { orgId: organizationId });
  }

  query.skip((page - 1) * perPage).take(perPage).orderBy('person.created_at', 'DESC');

  const [persons, total] = await query.getManyAndCount();

  const data = persons.map((p) => ({
    person_id: p.id,
    name: p.person_name,
    email: p.email?.[0] || '',
    phone: p.phone?.[0] || '',
  }));

  return {
    success: 'true',
    message: 'Person List Fetched',
    info: {
      per_page: perPage,
      page,
      total,
      is_next: page * perPage < total,
    },
    data,
  };
}


//Person's Lead
async getPersonLeads(personId: string, page: number, perPage: number,user: User) {
  const [leads, total] = await this.leadRepository.findAndCount({
    where: { person: { id: personId } },
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
  }))
  return {
    success: 'true',
    message: "Person's Leads Found",
    info: {
      per_page: perPage,
      page,
      total_leads: total,
      is_next: page * perPage < total,
    },
    data,
  };
}

//Person's Activity
async getPersonActivity(personId: string, query: GetPersonActivityDto) {
  const perPage = Number(query.per_page) || 10;
  const page = Number(query.page) || 1;

  const [activities, total] = await this.activityRepository.findAndCount({
    where: { person: { id: personId } },
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


}


{/**
  async searchPersons(filters: {
  per_page: number,
  page: number,
  search?: string,
  organization_id?: number
}) {
  const { per_page, page, search, organization_id } = filters;
  const skip = (page - 1) * per_page;

  const query = this.personRepo
    .createQueryBuilder('person')
    .leftJoinAndSelect('person.organization', 'organization')
    .orderBy('person.id', 'DESC');

  if (search) {
    query.andWhere(
      '(LOWER(person.person_name) LIKE :search OR LOWER(person.email) LIKE :search OR person.phone LIKE :search)',
      { search: `%${search.toLowerCase()}%` }
    );
  }

  if (organization_id) {
    query.andWhere('person.organization_id = :orgId', { orgId: organization_id });
  }

  const [persons, total] = await query.skip(skip).take(per_page).getManyAndCount();

  const data = persons.map(p => ({
    person_id: p.id,
    name: p.person_name || '',
    email: p.email || '',
    phone: p.phone || '',
  }));

  return {
    success: 'true',
    message: 'Person List Fetched',
    info: {
      per_page,
      page,
      total,
      is_next: page * per_page < total,
    },
    data,
  };
}
 */}