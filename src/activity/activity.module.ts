// src/activity/activity.module.ts

import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityController } from './activity.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Organization } from 'src/contacts/organization/entities/organization.entity';
import { Person } from 'src/contacts/person/entities/person.entity';
import { Lead } from 'src/leads/entities/lead.entity';
import { JwtModule } from '@nestjs/jwt';
import { ActivityType } from './entities/activity-type.entity';
import { ActivityPurpose } from './entities/activity-purpose.entity';
import { Activity } from './entities/activity.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User,Organization,Person,Lead, ActivityType, ActivityPurpose,Activity]),
JwtModule.register({}), ],
  controllers: [ActivityController],
  providers: [ActivityService],
})
export class ActivityModule {}
