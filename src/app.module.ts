 import {  Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { OrganizationModule } from './contacts/organization/organization.module';
import { Organization } from './contacts/organization/entities/organization.entity';
import { PersonModule } from './contacts/person/person.module';
import { Person } from './contacts/person/entities/person.entity';
import { CountryModule } from './general/country/country.module';
import { Country } from './general/country/entities/country.entity'
import { StateModule } from './general/state/state.module';
import { State } from './general/state/entities/state.entity';
import { CityModule } from './general/city/city.module';
import { City } from './general/city/entities/city.entity';

import { Pipeline } from './pipelines/entities/pipeline.entity';
import { PipelineStage } from './pipelines/entities/pipeline-stage.entity';
import { Lead } from './leads/entities/lead.entity';
import { LeadModule } from './leads/lead.module';
import { LeadAttachment } from './leads/entities/lead-attachment.entity';





@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),  // Loads environment variables
    TypeOrmModule.forRoot({
      type: 'postgres',  
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT as string, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [User,Organization,Person,Country,State,City,Pipeline,PipelineStage,Lead,LeadAttachment],
      synchronize: true,
    }),    
    AuthModule,
    OrganizationModule,
    PersonModule,
    CountryModule,
    StateModule,
    CityModule,
    LeadModule,
  ],


  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {}
