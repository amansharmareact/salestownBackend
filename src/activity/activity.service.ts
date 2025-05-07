
import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { ActivityPurpose } from './entities/activity-purpose.entity';
import { ActivityType } from './entities/activity-type.entity';
import { CreateActivityDto } from './dto/create-activity.dto';
import { Activity } from './entities/activity.entity';
import { Lead } from 'src/leads/entities/lead.entity';
import { Organization } from 'src/contacts/organization/entities/organization.entity';
import { PersonService } from 'src/contacts/person/person.service';
import { Person } from 'src/contacts/person/entities/person.entity';
import { User } from 'src/auth/entities/user.entity';
import {  ActivityFilterDto} from './dto/list-activity.dto';
import * as moment from 'moment';
import { SubmitReportDto } from './dto/submit-report.dto';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityType)
    private readonly activityTypeRepository: Repository<ActivityType>,
    @InjectRepository(ActivityPurpose)
    private readonly activityPurposeRepository: Repository<ActivityPurpose>,
    @InjectRepository(Activity)
    private readonly activityRepo : Repository<Activity>,
    @InjectRepository(Lead)
    private readonly leadRepo: Repository<Lead>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
    @InjectRepository(Person)
    private readonly personRepo: Repository<Person>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

  ) {}

  async getFilters() {
    const activities = await this.activityTypeRepository.find();
    const purposes = await this.activityPurposeRepository.find();

    return {
      success: "true",
      message: "Activity Fiters",
      activity: activities,
      purpose: purposes,
    };
  }

  //Create an Activity
  async createActivity(createDto: CreateActivityDto, user: any) {
    const {
      purpose,type, activity_title, date, from_time, to_time, activity_note,
      lead_id, person_id, organization_id, mark_done = 0, report, owner,
    } = createDto;
  
    const validPurpose = await this.activityPurposeRepository.findOne({ where: { id: purpose }});
    if (!validPurpose) {
      throw new BadRequestException('Invalid purpose id');
    }

    const validType = await this.activityTypeRepository.findOne({where: {id:type}});
    if(!validType){
      throw new BadRequestException('Invalid  type id');
    }
  
    const activity = this.activityRepo.create({
      purpose: validPurpose,
      type: validType,
      activity_title,
      date,
      from_time,
      to_time,
      activity_note,
      mark_done,
      report,
      owner: owner || user?.user_id,
    });
  
    if (lead_id) {
      const lead = await this.leadRepo.findOne({ where: { lead_id: lead_id } });
      if (!lead) throw new BadRequestException('Invalid lead_id');
      activity.lead = lead;
    }
  
    if (organization_id) {
      const org = await this.orgRepo.findOne({ where: { id: String(organization_id) } });
      if (!org) throw new BadRequestException('Invalid organization_id');
      activity.organization = org;
    }
  
    if (person_id) {
      const person = await this.personRepo.findOne({ where: { id: String(person_id) } });
      if (!person) throw new BadRequestException('Invalid person_id');
      activity.person = person;
    }
  
    const result = await this.activityRepo.save(activity);
  
    return {
      success: 'true',
      message: 'Activity Created Successfully',
      data:  {
        activity_id: activity.acitivity_id,
        activity_title: activity.activity_title,
        date: activity.date,
        from_time: activity.from_time,
        to_time: activity.to_time,
        mark_done: activity.mark_done,
        report: activity.report,
        purpose: {
          purpose: activity.purpose.purpose
        },
        type: {
          typr: activity.type.type
        },
        lead: {
          name: activity.lead.name
        },
        organization: {
          name: activity.organization.organization_name
        },
        person: {
          name: activity.person.person_name
        },
        //owner: {
        //  name: activity.owner.name
       // }
      }
    };
  }

async listActivities(user: User, filterDto: ActivityFilterDto) {
  const {
    per_page = 10,
    page = 1,  
    search,
    user_id,
    start_date,
    end_date,
    activity_type,
    purpose,
  } = filterDto;

  const take = Number(per_page);
  const skip = (Number(page) - 1) * take;

  const query = this.activityRepo.createQueryBuilder('activity')
    .leftJoinAndSelect('activity.purpose', 'purpose')
    .leftJoinAndSelect('activity.owner', 'owner')
    .leftJoinAndSelect('activity.organization', 'organization')
    .leftJoinAndSelect('activity.lead', 'lead')
    .where('1=1');

  if (search) {
    query.andWhere('(activity.activity_title ILIKE :search OR activity.report ILIKE :search)', { search: `%${search}%` });
  }

  if (user_id) {
    query.andWhere('activity.owner_id = :user_id', { user_id });
  }

  if (start_date) {
    query.andWhere('activity.date >= :start_date', { start_date });
  }

  if (end_date) {
    query.andWhere('activity.date <= :end_date', { end_date });
  }

  if (purpose) {
    query.andWhere('activity.purpose_id = :purpose', { purpose });
  }

  const [data, total] = await query
    .orderBy('activity.acitivity_id', 'DESC')
    .skip(skip)
    .take(take)
    .getManyAndCount();

  const transformed = data.map((act) => ({
    activity_id: act.acitivity_id,
    purpose: act.purpose?.purpose || null,
    icon: act.purpose?.icon || null,
    title: act.activity_title || '',
    activity_note: act.activity_note || '',
    activity_date: act.date,
    activity_time: act.from_time,
    activity_timestamp: Math.floor(new Date(`${act.date} ${act.from_time}`).getTime() / 1000),
    lead_title: act.lead?.title || '',
    organization_name: act.organization?.name || null,
    report: act.report,
    updated_at: null, 
    status: act.mark_done,
    is_assign: 0,
    created_at: act['created_at']?.toISOString().replace('T', ' ').substring(0, 19) || '',
    created_time: Math.floor(new Date(act['created_at']).getTime() / 1000),
    completed_at: '', 
    added_by: act.owner?.user_id || null,
    owner: act.owner?.name || '',   
  }));

  return {
    success: "true",
    message: "Activity data",
    details: {
      is_prev: Number(page) > 1,
      is_next: total > Number(page) * take,
      total_data: total,
      start: skip + 1,
      end: Math.min(skip + take, total),
    },
    data: transformed,
  };
}

async getActivityNotifications(user: any) {
  const activities = await this.activityRepo.find({
    where: { owner: { user_id: user.user_id } },
    relations: ['purpose', 'owner'],
    order: { created_at: 'DESC' },  
  });

  return activities.map(activity => ({
    activity_id: activity.acitivity_id,
    activity_title: activity.activity_title || '',
    date: activity.date,
    from_time: activity.from_time,
    activity_timestamp: Math.floor(
      new Date(`${activity.date}T${activity.from_time}:00`).getTime() / 1000,
    ).toString(),
    is_assign: 0,
    created_at: activity.created_at.toISOString().replace('T', ' ').split('.')[0],
    purpose: activity.purpose?.purpose || 'N/A',
    icon: this.getIconFromPurpose(activity.purpose?.icon),
    owner: activity.owner?.name || 'N/A',
  }));
}

private getIconFromPurpose(purpose: string): string {
  const iconMap = {
    Call: 'fa-phone',
    Meeting: 'fa-handshake',
    Email: 'fa-envelope',
    Task: 'fa-tasks',
  };
  return iconMap[purpose] || 'fa-calendar';
}

async getActivityForm() {
  // Fetch Activity Purposes
  const purposes = await this.activityPurposeRepository.find(); // Inject this repo

  // Fetch Users who have created at least one activity (owners)
  const owners = await this.activityRepo
    .createQueryBuilder('activity')
    .leftJoinAndSelect('activity.owner', 'owner')
    .select(['owner.user_id', 'owner.name'])
    .groupBy('owner.user_id')
    .getRawMany();

  const uniqueOwners = owners.map(o => ({
    id: o.owner_user_id,
    name: o.owner_name,
  }));

  return {
    success: 'true',
    message: 'Activity Form',
    data: [
      {
        label: 'Purpose',
        name: 'purpose',
        is_required: 1,
        values: purposes.map(p => ({
          id: p.id,
          purpose: p.purpose,
          icon: p.icon,
        })),
        type: 'dropdown',
      },
      {
        label: 'Title',
        name: 'title',
        is_required: 1,
        type: 'text',
      },
      {
        label: 'Date',
        name: 'date',
        is_required: 1,
        type: 'date',
      },
      {
        label: 'To',
        name: 'to_time',
        is_required: 1,
        values: this.generateTimeSlots(),
        type: 'dropdown',
      },
      {
        label: 'From',
        name: 'from_time',
        is_required: 1,
        values: this.generateTimeSlots(),
        type: 'dropdown',
      },
      {
        label: 'Description',
        name: 'activity_note',
        is_required: 0,
        type: 'text',
      },
      {
        label: 'Lead',
        name: 'lead_id',
        is_required: 0,
        type: 'dropdown', // values not provided yet
      },
      {
        label: 'Assign Activity To',
        name: 'owner',
        is_required: 0,
        values: uniqueOwners,
        type: 'dropdown',
      },
    ],
  };
}

// Helper to generate time slots
generateTimeSlots() {
  const times = [];
  for (let hour = 1; hour < 24; hour++) {
    for (let min of [0, 30]) {
      const key = `${hour < 10 ? '0' + hour : hour}:${min === 0 ? '00' : '30'}`;
      const isPM = hour >= 12;
      const displayHour = hour > 12 ? hour - 12 : hour;
      const value = `${displayHour < 10 ? '0' + displayHour : displayHour}:${min === 0 ? '00' : '30'}${isPM ? 'PM' : 'AM'}`;
   //   times.push({ key, value });
    }
  }
  return times;
}

//Activity Report Submit
async submitReport(activityId: number, body: SubmitReportDto, userId: string) {
  const activity = await this.activityRepo.findOne({
    where: { acitivity_id: activityId },
    relations: ['owner'],
  });

  if (!activity) {
    throw new NotFoundException('Activity not found');
  }

  // Optional: Only allow owner to submit report
 // if (activity.owner.user_id !== userId) {
  //  throw new ForbiddenException('You are not allowed to submit report for this activity');
  //}

  activity.report = body.report;
  activity.custom_column_id=body.custom_column_id,
  activity.custom_field_value=body.custom_field_value,
  activity.completed_at = new Date();
  activity.mark_done = 1;

  await this.activityRepo.save(activity);

  // Optional: Save custom_field_value & custom_column_id
  // You should create a relation table like `ActivityReportCustomField`
  // to store these if needed
}



  
}


{/**
  // activity.service.ts
async submitReport(activityId: number, body: SubmitReportDto, userId: string) {
  const activity = await this.activityRepo.findOne({
    where: { acitivity_id: activityId },
    relations: ['owner'],
  });

  if (!activity) {
    throw new NotFoundException('Activity not found');
  }

  // Optional: Only allow owner to submit report
 // if (activity.owner.user_id !== userId) {
  //  throw new ForbiddenException('You are not allowed to submit report for this activity');
  //}

  activity.report = body.submit_report;
  activity.completed_at = new Date();
  activity.mark_done = 1;

  await this.activityRepo.save(activity);

  // Optional: Save custom_field_value & custom_column_id
  // You should create a relation table like `ActivityReportCustomField`
  // to store these if needed
} */}