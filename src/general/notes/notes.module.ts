import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Note } from './entities/notes.entity';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { Lead } from 'src/leads/entities/lead.entity';
import { Organization } from 'src/contacts/organization/entities/organization.entity';
import { Person } from 'src/contacts/person/entities/person.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/auth/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Note,Lead,Organization,Person,User]),  JwtModule.register({}), ],
  controllers: [NotesController],
  providers: [NotesService],
})
export class NotesModule {}
