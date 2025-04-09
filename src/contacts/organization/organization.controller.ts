// src/organization/organization.controller.ts
import { Controller, Post, Body, UseGuards, Headers } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationService } from './organization.service';
import { Req } from '@nestjs/common';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly orgService: OrganizationService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  async addOrganization(@Body() dto: CreateOrganizationDto, @Req() req: any) {
    return this.orgService.createOrganization(dto, req.user);
  }
}
