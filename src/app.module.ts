 import {  Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';
import { OrganizationModule } from './contacts/organization/organization.module';
import { Organization } from './contacts/organization/entities/organization.entity';
import { PersonModule } from './contacts/person/person.module';
import { Person } from './contacts/person/entities/person.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true}),  // Loads environment variables
    TypeOrmModule.forRoot({
      type: 'postgres',  // ✅ Add this line
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT as string, 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'authdb',
      entities: [User, Organization,Person],
      synchronize: true,
      ssl:{
        rejectUnauthorized:false,
      }
    }),    
    AuthModule,
    OrganizationModule,
    PersonModule

  ],
  //controllers: [AppController],
  //providers: [AppService],
})
export class AppModule {}
