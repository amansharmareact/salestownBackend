
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { GetPersonActivityDto } from './dto/get-org-leads.dto';

@Controller('person')
export class PersonController {
  constructor(private readonly personService: PersonService) {}

  @Post('add')
  @UseGuards(JwtAuthGuard)
  async addPerson(@Body() dto: CreatePersonDto) {
    return this.personService.addPerson(dto);
  }


@Get('view/:person_id')
@UseGuards(JwtAuthGuard)
async viewPersonFlexible(
  @Param('person_id') personId: number,
  @Query() query: any,
  @Body() body: any,
  @Req() req: any, 
) {
  // Merge all params into one object
  const params = {
    person_id: personId || query.person_id || body.person_id,
  };

  return this.personService.viewPerson(params,req.user);
}

//Update Person
@Patch('update/:person_id')
@UseGuards(JwtAuthGuard)
async updatePerson(
  @Param('person_id') id:string,
  @Body() dto: UpdatePersonDto
){
  return this.personService.updatePerson(id, dto)
}

//Delete Person
@Delete('delete/:id')
@UseGuards(JwtAuthGuard)
 async deletePerson(
  @Param('id') id:string
 ){
  return this.personService.deletePerson(id);
 }

 //LISt ALL PRSONS


@Post('all')
@UseGuards(JwtAuthGuard)
async listPersons(
  @Query() query: any,
  @Body() body: any,
  @Req() req
) {
  const filters = {
    per_page: Number(query.per_page || body.per_page || 10),
    page: Number(query.page || body.page || 1),
    search: query.search || body.search || '',
    user_id: Number(query.user_id || body.user_id || null),
    start_date: query.start_date || body.start_date || null,
    end_date: query.end_date || body.end_date || null,
  };

  return this.personService.listAllPersons(filters);
}

// Search Person 
@Get('search')
@UseGuards(JwtAuthGuard)
async searchPersons(
  @Query('per_page') perPage = 10,
  @Query('page') page = 1,
  @Query('search') search?: string,
  @Query('organization_id') orgId?: string,
) {
  return this.personService.searchPersons(+page, +perPage, search, orgId);
}




@Get('leads/:person_id')
@UseGuards(JwtAuthGuard) // if using JWT
async getPersonLeads(
  @Param('person_id') personId: string,
  @Query('per_page') perPage = 10,
  @Query('page') page = 1,
  @Req() req: any,
) {
  const user = req.user;
  return this.personService.getPersonLeads(personId, +page, +perPage,user);
}

@Get('activity/:person_id')
@UseGuards(JwtAuthGuard) // Ensure this route is protected
async getOrganizationActivity(
  @Param('person_id') personId: string,
  @Query() query: GetPersonActivityDto,
  @Req() req: any,
) {
  return this.personService.getPersonActivity(personId, query);
}

}


{/**
  @Get('search')
@UseGuards(JwtAuthGuard)
async searchPersons(
  @Query() query: any,
  @Body() body: any
) {
  const filters = {
    per_page: Number(query.per_page || body.per_page || 10),
    page: Number(query.page || body.page || 1),
    search: query.search || body.search || '',
    organization_id: query.organization_id || body.organization_id || null,
  };

  return this.personService.searchPersons(filters);
} */}