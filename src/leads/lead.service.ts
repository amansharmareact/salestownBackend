import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lead } from './entities/lead.entity';
import { CreateLeadDto } from './dto/create-lead.dto';
import { Pipeline } from 'src/pipelines/entities/pipeline.entity';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Injectable()
export class LeadService {
  constructor(
    @InjectRepository(Lead)
    private leadRepository: Repository<Lead>,
    @InjectRepository(Pipeline)
    private pipelineRepository: Repository<Pipeline>,
  ) {}

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
      console.error(' Error creating lead:', error);
      throw new Error('Error creating lead');
    }
  }
  

  // lead.service.ts

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

  //Edit Lead
  async updateLead(lead_id: number, updateLeadDto: UpdateLeadDto): Promise<Lead> {
    const lead = await this.leadRepository.findOne({
        where: { lead_id: lead_id },});

    if (!lead) {
      throw new Error('Lead not found');
    }

    Object.assign(lead, updateLeadDto);

    return this.leadRepository.save(lead);
  }

  //Delete a Lead
  async deleteLead(lead_id: number): Promise<void> {
    const lead = await this.leadRepository.findOne({ where: { lead_id: lead_id } });
  
    if (!lead) {
      throw new Error('Lead not found');
    }
  
    await this.leadRepository.remove(lead);
  }
  
  //Get Leads

async getLeads(filters: any, user: any) {
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
      salesperson: user.name || 'N/A', //
      lead_activity_flag: 'warning', //
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
 
  
}

{/**
     async getLeads(query: any, user: any,) {
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
    } = query;
  
    const take = Number(per_page);
    const skip = (Number(page) - 1) * take;
  
    const qb = this.leadRepository
      .createQueryBuilder('lead')
      .leftJoinAndSelect('lead.organization', 'organization')
      .leftJoinAndSelect('lead.person', 'person')
      .leftJoinAndSelect('lead.pipeline', 'pipeline')
      .leftJoinAndSelect('lead.pipelineStage', 'pipelineStage')
      //.leftJoinAndSelect('lead.salesperson', 'salesperson')
      .where('1=1');
  
    if (search) {
      qb.andWhere('(lead.title ILIKE :search OR organization.name ILIKE :search OR person.name ILIKE :search)', {
        search: `%${search}%`
      });
    }
  
    if (user_id) qb.andWhere('lead.user_id = :user_id', { user_id });
    if (pipeline_id) qb.andWhere('lead.pipeline_id = :pipeline_id', { pipeline_id });
    if (pipestage_id) qb.andWhere('lead.pipelineStage_id = :pipelinetage_id', { pipestage_id });
    if (lead_type) qb.andWhere('lead.lead_type = :lead_type', { lead_type });
    if (country) qb.andWhere('lead.country = :country', { country });
    if (state) qb.andWhere('lead.state = :state', { state });
    if (city) qb.andWhere('lead.city = :city', { city });
    if (pincode) qb.andWhere('lead.pincode = :pincode', { pincode });
    if (source) qb.andWhere('lead.source = :source', { source });
  
    if (start_date && end_date) {
      qb.andWhere('lead.created_at BETWEEN :start AND :end', {
        start: `${start_date} 00:00:00`,
        end: `${end_date} 23:59:59`,
      });
    }
  
    if (update_start_date && update_end_date) {
      qb.andWhere('lead.updated_at BETWEEN :u_start AND :u_end', {
        u_start: `${update_start_date} 00:00:00`,
        u_end: `${update_end_date} 23:59:59`,
      });
    }
  
    const [leads, total] = await qb.skip(skip).take(take).getManyAndCount();
  
    const data = leads.map((lead) => ({
      lead_id: lead.lead_id,
      title: lead.title,
      pipeline_id: lead.pipeline?.id,
      pipestage_id: lead.pipelineStage?.id,
      value: lead.value,
      organization_name: lead.organization?.organization_name || 'no organization',
      person_name: lead.person?.person_name || '',
      tag_name: lead.tag_name,
      tag_color: lead.tag_color,
      tag_color_code: lead.tag_color_code,
      salesperson: lead.person?.person_name || null,
      lead_activity_flag: lead.lead_activity_flag || null
    }));
  
    return {
      success: 'true',
      message: 'Lead Fetched',
      userAccess: {
        is_delete_lead: 0, // You can fetch from permissions table based on user.role
      },
      pipelines: await this.getPipelinesWithStages(),
      info: {
        is_next: total > skip + take,
        total_data: total,
        start: skip + 1,
        end: Math.min(skip + take, total),
        total_values: leads.reduce((acc, lead) => acc + Number(lead.value || 0), 0),
      },
      data,
    };
  }
  async getPipelinesWithStages() {
    const pipelines = await this.pipelineRepository.find({
      relations: ['pipestages'],
      order: { id: 'ASC' }
    });
  
    return pipelines.map(pipeline => ({
      id: pipeline.id,
      name: pipeline.name,
      pipestages: pipeline.pipestages.map(stage => ({
        id: stage.id,
        name: stage.name
      }))
    }));
  }
  







  async getLeads(user: any, query: any) {
    const { name, user_id } = user; // or whatever fields you want
  
    // For example: Filter leads assigned to the salesperson
    const leads = await this.leadRepository
      .createQueryBuilder('lead')
      .leftJoinAndSelect('lead.pipelineStage', 'pipelineStage')
      .where('lead.assigned_to = :user_id', { user_id }) // optional filter
      .getMany();
  
    return {
      success: true,
      message: 'Leads fetched successfully',
      data: leads,
      login_user_name: name, // include the logged-in user's name
    };
  }
   */}
