import { Controller, Post, Body, Headers, UseGuards, Req, Get, Param, ParseIntPipe, Patch, Delete, Query } from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateLeadDto } from './dto/update-lead.dto';

@Controller('leads')
export class LeadController {
  constructor(private readonly leadService: LeadService) {}
  @Post('/add')
  @UseGuards(JwtAuthGuard)
  async createLead(@Body() createLeadDto: CreateLeadDto, @Req() req) {
    const user = req.user; // JWT
    return this.leadService.createLead(createLeadDto, user);
  }

// lead.controller.ts

//Get Lead by Id
@Get('view/:lead_id')
@UseGuards(JwtAuthGuard) // use your JWT auth guard
async viewLead(@Param('lead_id') leadId: number, @Req() req) {
  const user = req.user; // from JWT
  return await this.leadService.viewLead(leadId, user);
}

//Edit LEad
@Patch('update/:lead_id')
@UseGuards(JwtAuthGuard)
async updateLead(
  @Param('lead_id') lead_id: number,
  @Body() updateLeadDto: UpdateLeadDto,
) {
  const updatedLead = await this.leadService.updateLead(lead_id, updateLeadDto);
  return {
    success: 'true',
    message: 'Lead Updated',
  };
}


@Delete('delete/:lead_id')
@UseGuards(JwtAuthGuard)
async deleteLead(@Param('lead_id') lead_id: number) {
  await this.leadService.deleteLead(lead_id);
  return {
    success: 'true',
    message: 'Lead deleted',
  };
}


@Get()
@UseGuards(JwtAuthGuard)
async getLeads(
  @Query() query: any, // or use a DTO 
  @Req() req: any,
) {
  return this.leadService.getLeads(query, req.user);
}



  
}

{/**
    @Get()
@UseGuards(JwtAuthGuard)
async listLeads(
  @Query() query: any,
  @Req() req: any,
) {
const user = req.user; 
  return await this.leadService.getLeads(query, req.user);
} */}