// src/contacts/person/person.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';

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
}
