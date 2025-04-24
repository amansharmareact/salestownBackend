import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from './entities/lead.entity';
import { LeadController } from './lead.controller';
import { LeadService } from './lead.service';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/auth/entities/user.entity';
import { Organization } from 'src/contacts/organization/entities/organization.entity';
import { Person } from 'src/contacts/person/entities/person.entity';
import { PipelineStage } from 'src/pipelines/entities/pipeline-stage.entity';
import { Pipeline } from 'src/pipelines/entities/pipeline.entity';
import { Country } from 'src/general/country/entities/country.entity';
import { City } from 'src/general/city/entities/city.entity';
import { State } from 'src/general/state/entities/state.entity';
import { LeadAttachment } from './entities/lead-attachment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Lead,PipelineStage,User,Organization,Person,Pipeline,Country,City,State,LeadAttachment]),
  JwtModule.register({}), ],
  controllers: [LeadController],
  providers: [LeadService],
})
export class LeadModule {}
