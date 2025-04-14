// src/contacts/person/person.service.ts
import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { Organization } from '../organization/entities/organization.entity';
import { UpdatePersonDto } from './dto/update-person.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepo: Repository<Person>,
    @InjectRepository(Organization)
    private readonly orgRepo: Repository<Organization>,
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
}
