import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from './entities/notes.entity';
import { Repository } from 'typeorm';
import { AddNoteDto } from './dto/notes.dto';
import { Lead } from 'src/leads/entities/lead.entity';
import { Organization } from 'src/contacts/organization/entities/organization.entity';
import { Person } from 'src/contacts/person/entities/person.entity';

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private readonly noteRepo: Repository<Note>,
    @InjectRepository(Lead)
    private readonly leadRepository: Repository<Lead>,
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async addNote(dto: AddNoteDto) {
    const { lead_id, organization_id, person_id, notes } = dto;

    if (lead_id) {
        const leadExists = await this.leadRepository.findOne({ where: { lead_id: lead_id } });
        if (!leadExists) {
          throw new NotFoundException(`Lead with ID ${lead_id} not found`);
        }
      }

      if (organization_id) {
        const organizationExists = await this.organizationRepository.findOne({ where: { id: organization_id } });
        if (!organizationExists) {
          throw new NotFoundException(`Organization with ID ${organization_id} not found`);
        }
      }

      if(person_id){
        const personExists = await this.personRepository.findOne({ where: {id: person_id }});
        if(!personExists) {
            throw new NotFoundException(`Person with Id ${person_id} not found`)
        }
      }

    // Count how many IDs are provided
    const idCount =
      [lead_id, organization_id, person_id].filter((id) => id !== undefined && id !== null).length;
  
    if (idCount === 0) {
      throw new BadRequestException('At least one of lead_id, organization_id, or person_id is required');
    }
  
    if (idCount > 1) {
      throw new BadRequestException('Only one of lead_id, organization_id, or person_id is allowed');
    }

    
  
    const note = this.noteRepo.create({ lead_id, organization_id, person_id, notes });
    const saved = await this.noteRepo.save(note);
  
    return {
      success: "true",
      message: "Notes added",
      notes_id: saved.id,
    };
  }
  
}
