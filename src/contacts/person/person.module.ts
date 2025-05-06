// src/contacts/person/person.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from './entities/person.entity';
import { PersonService } from './person.service';
import { PersonController } from './person.controller';
import { Organization } from '../organization/entities/organization.entity';
import { User } from 'src/auth/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { Lead } from 'src/leads/entities/lead.entity';
import { Pipeline } from 'src/pipelines/entities/pipeline.entity';
import { PipelineStage } from 'src/pipelines/entities/pipeline-stage.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { Note } from 'src/general/notes/entities/notes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Person, Organization, User,Lead,Pipeline,PipelineStage,Activity,Note]),
  JwtModule.register({}), 
],
  controllers: [PersonController],
  providers: [PersonService],
  exports: [TypeOrmModule],
})
export class PersonModule {}

