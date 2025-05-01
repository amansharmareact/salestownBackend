
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Delete,
  Get,
  Query,
  Search,
  Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { OrganizationService } from './organization.service';
import { Req } from '@nestjs/common';
import { UpdateOrganizationDto } from './dto/update-organization.dto';


@Controller('organization')
export class OrganizationController {
  organizationService: any;
  constructor(private readonly orgService: OrganizationService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  async addOrganization(@Body() dto: CreateOrganizationDto, @Req() req: any) {
    return this.orgService.createOrganization(dto, req.user);
  }

  // organization.controller.ts
@UseGuards(JwtAuthGuard) // Assuming you have JWT auth guard
@Post('update/:org_id')
async updateOrganization(
  @Param('org_id') orgId: string,
  @Body() dto: UpdateOrganizationDto,
  @Req() req: any,
) {
  const userId = req.user.user_id; // Use logged-in user ID
  dto.owner = userId; // Override the owner in DTO
  const result = await this.orgService.updateOrganization(orgId, dto);
  return result;
}


  // DELETE /organization/delete/:org_id
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  async deleteOrganization(
    //@Param('org_id') paramId: string,
    @Body('org_id') bodyId: string,
    @Query('org_id') queryId: string,
    @Req() req: any,
  ) {
    const org_id = bodyId || queryId; // paramId
    return this.orgService.deleteOrganization(org_id, req.user);
  }

  // View Organization by ID

  @Get('view')
  @UseGuards(JwtAuthGuard)
  async viewOrganization(
    //@Param('org_id') paramOrgId: string,
    @Query('org_id') queryOrgId: string,
    @Body('org_id') bodyOrgId: string,
    @Req() req: any,
  ) {
    // Determine org_id from whichever is provided
    const orgId = queryOrgId || bodyOrgId; //paramOrgId

    if (!orgId) {
      return {
        success: 'false',
        message: 'Organization ID is required in params, query, or body',
      };
    }
    return this.orgService.viewOrganization(orgId, req.user);
  }

  // accepts parameters either as query or in the body
  @Get()
  @UseGuards(JwtAuthGuard)
  async getOrganizations(@Query() filters: any, @Req() req: any) {
    const user = req.user;
    return this.orgService.getOrganizations(filters, user);
  }

  //GEt Organization Based Cities
  @Get('cities')
  @UseGuards(JwtAuthGuard)
  async getOraganizationCities(
    @Query('search') search:string
  ) {
    return this.orgService.getOrganizationCities(search)
  }

  //GEt organization By Search
  @Get('search')
  @UseGuards(JwtAuthGuard)
  async searchOrganizations(
    @Query('per_page') per_page= 10,
    @Query('page') page=1,
    @Query('search') search='',
  ) {
    return this.orgService.searchOrganizations({
      per_page: +per_page,
        page: +page,
    search,
    })
  }

  @Get('leads/:org_id')
@UseGuards(JwtAuthGuard)
async getLeadsByOrganization(
  @Param('org_id') orgId: string,
  @Query('per_page') perPage = 10,
  @Query('page') page = 1
) {
  return this.organizationService.getLeadsByOrganization({
    orgId,
    perPage: +perPage,
    page: +page
  });
}

}     
