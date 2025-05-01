import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { Pipeline } from 'src/pipelines/entities/pipeline.entity';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { User } from 'src/auth/entities/user.entity';
import { Country } from 'src/general/country/entities/country.entity';
import { City } from 'src/general/city/entities/city.entity';
import { State } from 'src/general/state/entities/state.entity';
import { LeadAttachment } from './entities/lead-attachment.entity';
import { MarkLeadLostDto } from './dto/mark-lead-lost.dto';
import { MarkLeadWonDto } from './dto/mark-lead-won.dto';


@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(Pipeline)
    private pipelineRepository: Repository<Pipeline>,
    @InjectRepository(User)
    private userRepository : Repository<User>,
    @InjectRepository(Country)
    private readonly countryRepository: Repository<Country>,
    @InjectRepository(State)
     private readonly stateRepository: Repository<State>,
     @InjectRepository(City)
      private cityRepository: Repository<City>,
      @InjectRepository(LeadAttachment)
    private readonly attachmentRepository: Repository<LeadAttachment>,
  ) {}

  //APi ->> Crete A LEAD
  async createLead(createLeadDto: CreateLeadDto, user: any): Promise<any> {
    try {
      const {
        organization_id,
        person_id,
        pipeline_id,
        pipestage_id,
        ...rest
      } = createLeadDto;
  
      const lead = this.leadRepository.create({
        ...rest,
        organization: { id: organization_id },
        person: { id: person_id },
        pipeline: { id: pipeline_id },
        pipelineStage: { id: pipestage_id },
        created_by: { user_id: user.user_id }, //important
      });
  
      await this.leadRepository.save(lead);
  
      return {
        success: true,
        message: 'Lead added',
        lead_id: lead.lead_id,
      };
    } catch (error) {
      //console.error(' Error creating lead:', error);
      console.error('Detailed createLead error:', error);
      throw new Error('Error creating lead');
    }
  }
  

//API ->> View LEAD BY ID
async viewLead(lead_id: number, user: any) {
    const lead = await this.leadRepository.findOne({
      where: { lead_id: lead_id },
      relations: ['person', 'organization', 'pipeline', 'pipelineStage']
    });
  
    if (!lead) {
      throw new NotFoundException('Lead not found');
    }
  
    const pipelines = await this.pipelineRepository.find({
      relations: ['pipestages'],
      order: { id: 'ASC' }
    });
  
    const canDelete = lead.created_by_user_id === user.user_id ? 1 : 0;
  
    return {
      success: "true",
      message: "Lead fetched",
      access: { can_delete: canDelete },
      data: {
        pipelines: pipelines.map(pipe => ({
          id: pipe.id,
          name: pipe.name,
          pipestages: pipe.pipestages.map(stage => ({
            id: stage.id,
            name: stage.name
          }))
        })),
        info: {
          lead_id: lead.lead_id,
          lead_title: lead.title,
          person_name: lead.person?.person_name,
          organization_name: lead.organization?.organization_name,
          value: lead.value,
          email: lead.person?.email || [],
          phone: lead.person?.phone || [],
          pipeline_id: lead.pipeline?.id,
          pipestage_id: lead.pipelineStage?.id,
          total_pipestage: lead.pipeline?.pipestages?.length || 0,
        },
        details: {
          contacts: {
            address: lead.address || '',
            address_line_2: lead. address_line_2 || '',
            country: lead.country,
            state: lead.state,
            city: lead.city,
            pincode: lead.pincode
          },
          overview: {
            source: lead.source,
            lead_age: this.calculateDays(lead.created_at),
            in_active_day: this.calculateInactiveDays(lead.updated_at),
            created_at: lead.created_at,
            expected_date: lead.expected_close_date || '',
            won_probability: lead.won_probability || ''
          },
          access: {
            owner_id: lead.created_by_user_id,
            owner: lead.ownerName
          }
        }
      }
    };
  }
  private calculateDays(date: Date): number {
    const now = new Date();
    const created = new Date(date);
    const diff = now.getTime() - created.getTime();
    return Math.floor(diff / (1000 * 3600 * 24));
  }
  
  private calculateInactiveDays(updatedAt: Date): number {
    const now = new Date();
    const updated = new Date(updatedAt);
    const diff = now.getTime() - updated.getTime();
    return Math.floor(diff / (1000 * 3600 * 24));
  }

  //API ->Edit Lead
  async updateLead(lead_id: number, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
        where: { lead_id: lead_id },});

    if (!lead) {
      throw new Error('Lead not found');
    }

    Object.assign(lead, updateLeadDto);

    return this.leadRepository.save(lead);
  }

  //API -> Delete a Lead
  async deleteLead(lead_id: number): Promise<void> {
    const lead = await this.leadRepository.findOne({ where: { lead_id: lead_id } });
  
    if (!lead) {
      throw new Error('Lead not found');
    }
  
    await this.leadRepository.remove(lead);
  }
  
  //API ->Get Leads

async getLeads(filters: any, user: any,) {
    const {
      per_page = 10,
      page = 1,
      search,
      user_id,
      pipeline_id,
      pipestage_id,
      lead_type,
      country,
      state,
      city,
      pincode,
      source,
      start_date,
      end_date,
      update_start_date,
      update_end_date
    } = filters;
  
    const skip = (page - 1) * per_page;
  
    //  query based on filters
    const queryBuilder = this.leadRepository.createQueryBuilder('lead')
      .leftJoinAndSelect('lead.organization', 'organization')
      .leftJoinAndSelect('lead.person', 'person')
      .where('1 = 1');
  
    if (search) {
      queryBuilder.andWhere('lead.title ILIKE :search', { search: `%${search}%` });
    }
  

  
    queryBuilder.skip(skip).take(per_page);
  
    const [leads, total] = await queryBuilder.getManyAndCount();
  
    // Fetch all pipelines with pipestages
    const pipelines = await this.pipelineRepository.find({
      relations: ['pipestages'],
    });
  
    const transformedLeads = leads.map((lead) => ({
      lead_id: lead.lead_id,
      title: lead.title,
      pipeline_id: lead.pipeline_id,
      pipestage_id: lead.pipestage_id,
      value: lead.value,
      organization_name: lead.organization?.organization_name || 'no organization',
      person_name: lead.person?.person_name || '',
      tag_name: null,
      tag_color: null,
      tag_color_code: null,
      salesperson: user.name || 'N/A',
      lead_activity_flag: 'warning',
    }));
  
    return {
      success: 'true',
      message: 'Lead Fetched',
      userAccess: {
        is_delete_lead: 0,
      },
      pipelines: pipelines.map((p) => ({
        id: p.id,
        name: p.name,
        pipestages: p.pipestages.map((stage) => ({
          id: stage.id,
          name: stage.name,
        })),
      })),
      info: {
        is_next: total > page * per_page,
        total_data: total,
        start: skip + 1,
        end: skip + transformedLeads.length,
        total_values: 94576, // hardcoded 
      },
      data: transformedLeads,
    };
  }

  //Filter LEADS
  async getLeadFilters(user: any) {
    const [pipelines, users, countries, states, cities, ] = await Promise.all([  //sources
      this.pipelineRepository.find({
        relations: ['pipestages'],
      }),
      this.userRepository.find({
        select: ['user_id', 'name'],
      }),
      this.countryRepository.find({
        select: ['name'],
      }),
      this.stateRepository.find({
        select: ['name'],
      }),
      this.cityRepository.find({
        select: ['name'],
      }),
    ]);
  
    // pipeline with pipelineStages
    const formattedPipelines = pipelines.map((pipeline) => ({
      id: pipeline.id,
      name: pipeline.name,
      pipestages: pipeline.pipestages.map((stage) => ({
        id: stage.id,
        name: stage.name,
      })),
    }));
  
    // Hardcode
    const leads_type = [
      { id: 0, value: "All Active leads" },
      { id: 1, value: "All Won leads" },
      { id: 2, value: "All Lost leads" },
      { id: 3, value: "Stage Change due" },
      { id: 4, value: "More than 1 month old active leads" },
      { id: 5, value: "More than 3 month old active leads" },
      { id: 6, value: "All Active Duplicates" },
    ];

    // Hardcoding pincodes and sources
    const pincodes = [
      '88', '201309', '221001', '100200', '20000', '0', '111', '11', '1919',
      '23456', '66', '2345', '987', '10001', '220001', '22222', '222222', '88888',
      '34567', '5678', '777', '1970', '11100', '119909', '11340', '221002', '24354',
      '12232', '110', '123456', '20', '7400', '77', '222', '5000', '200', '501', '100',
      '8500', '700', '74'
    ];

    const sources = [
      { id: 1, value: 'SalesTown' },
      { id: 2, value: 'Website (API)' },
      { id: 3, value: 'Web Form' },
      { id: 4, value: 'Facebook' },
      { id: 5, value: 'IVR' },
      { id: 6, value: 'Indiamart' },
      { id: 7, value: 'Justdial' },
      { id: 8, value: 'Tradeindia' },
      { id: 9, value: 'Chatbot' },
      { id: 10, value: 'WhatsApp' },
      { id: 11, value: '99 Acres' },
      { id: 12, value: 'Magic Bricks' },
      { id: 13, value: 'Housing' },
    ];

  
    const response = {
      success: "true",
      message: "Lead Filters",
      fixed: {
        pipelines: formattedPipelines,
        users,
        leads_type,
      },
      advance: {
        countries: countries.map((c) => c.name),
        states: states.map((s) => s.name),
        cities: cities.map((c) => c.name),
        pincodes: pincodes,
        sources: sources,
      //  pincodes: await this.getAllUniquePincodes(), // Optional
      //  source: sources.map((s) => ({
      //    id: s.id,
       //   value: s.name,
      //  })),
      },
    };
  
    return response;
  }

  //API->> Attact file with Lead
  
  async attachFileToLead(lead_id: number, file: Express.Multer.File) {
    const lead = await this.leadRepository.findOne({ where: { lead_id } });

    if (!lead) {
      throw new NotFoundException('Lead not found');
    }

    const attachment = this.attachmentRepository.create({
      filename: file.filename,
      originalname: file.originalname,
      mimetype: file.mimetype,
      path: file.path,
      size: file.size,
      lead,
      lead_id: lead.lead_id,
    });

    await this.attachmentRepository.save(attachment);
  }



//API-> MARK LEAD AS WON
async markLeadWon(lead_id: number, markLeadWonDto:MarkLeadWonDto ) {

  const {submit_value , discount, won_value, won_check } = markLeadWonDto

  const lead = await this.leadRepository.findOne({ where: { lead_id } });

  if (!lead) {
   // throw new Error('Lead not found');
   throw new NotFoundException('Lead not found');
  }
 
  if (lead.is_won) {
    throw new BadRequestException('This lead is Already Marked as Won');
  }

  if (lead.is_lost) {
    throw new BadRequestException('You can not Mark this Lead as Won ,This is Already Lost');
  }

  //  setting respective values
  lead.is_won = true;  //mark the lead as won
  lead.submit_value = submit_value;
  lead.discount = discount;
  lead.won_value =won_value;
  lead.won_check =won_check;  // Assuming won_check is an array field

  await this.leadRepository.save(lead);

  return {
    success: 'true',
    message: 'Lead Won',
  };
}

//API -> LEAD WON VIEW
async getLeadWonView(lead_id: number) {
  const lead = await this.leadRepository.findOne({
    where: { lead_id},
    relations: [],
  });

  if (!lead) {
   // throw new Error('Won lead not found');
   throw new NotFoundException('Lead not found');
  }

  if (lead.is_lost) {
    throw new BadRequestException('This lead is not marked as Won');
  }

  return {
    success: 'true',
    message: 'Lead Won View',
    data: {
      lead_id: lead.lead_id,
      name: lead.name,
      title: lead.title,
      value: lead.value,
      submit_value: lead.submit_value,
      discount: lead.discount,
      won_value: lead.won_value,
      won_check: lead.won_check,
      won_date: lead.updated_at, 
    },
  };
}


// API -> MARK LEAD AS LOST
async markLeadAsLost(lead_id: number, markLeadLostDto: MarkLeadLostDto) {
  const { lost_reason_id,lost_reason, comment } = markLeadLostDto;

  const lead = await this.leadRepository.findOne({ where: { lead_id } });

  if (!lead) {
    throw new NotFoundException('Lead not found');
  }

  if (lead.is_lost) {
    throw new BadRequestException('This lead is Already Marked as Lost');
  }

  if (lead.is_won) {
    throw new BadRequestException('You can not Mark this Lead as lost ,This Lead is already Won');
  }

  // Mark the lead as lost with reason and comment
  lead.is_lost = true;
  lead.lost_reason_id = lost_reason_id;
  lead.lost_reason = lost_reason;
  lead.comment = comment;

  await this.leadRepository.save(lead);
}

//API -> LEAD LOST VIEW
async getLostLeadDetails(lead_id: number) {
  const lead = await this.leadRepository.findOne({
    where: { lead_id },
    select: ['lead_id', 'name', 'lost_reason_id', 'lost_reason', 'comment', 'is_won'], 
  });

  if (!lead) {
    throw new NotFoundException('Lead not found');
  }

  if (lead.is_won) {
    throw new BadRequestException('This lead is not marked as lost');
  }

  return lead;
}
  

}
