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
import { ActivityModule } from './activity/activity.module';
import { ActivityPurpose } from './activity/entities/activity-purpose.entity';
import { ActivityType } from './activity/entities/activity-type.entity';
import { Activity } from './activity/entities/activity.entity';
import { Category } from './product/entities/category.entity';
import { ProductModule } from './product/product.module';
import { Product } from './product/entities/product.entity';
import { NotesModule } from './general/notes/notes.module';
import { Note } from './general/notes/entities/notes.entity';


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
      entities: [User,Organization,Person,Country,State,City,Pipeline,PipelineStage,Lead,LeadAttachment,
        ActivityPurpose,ActivityType,Activity,Category,Product,Note],
      synchronize: true,
      ssl:{
        rejectUnauthorized:false,
      }
      
    }),  
    AuthModule,
    OrganizationModule,
    PersonModule,
    CountryModule,
    StateModule,
    CityModule,
    LeadModule,
    ActivityModule,
    ProductModule,
    NotesModule,
  ],


  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {}
