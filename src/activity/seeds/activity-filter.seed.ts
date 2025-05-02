import { DataSource } from 'typeorm';
import { ActivityPurpose } from '../entities/activity-purpose.entity';
import { ActivityType } from '../entities/activity-type.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const seed = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT as string, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
     // entities: [ActivityPurpose,ActivityType], // entities here
     entities: ['src/**/*.entity{.ts,.js}'], 
      synchronize: true,  // Keep false to avoid auto-syncing during script execution
      ssl:{
        rejectUnauthorized:false,
      }
  });

  await dataSource.initialize();

  const activityTypeRepo = dataSource.getRepository(ActivityType);
  const activityPurposeRepo = dataSource.getRepository(ActivityPurpose);

  const activities = [
    { id: 0, type: 'All' },
    { id: 1, type: 'Overdue' },
    { id: 2, type: 'Upcoming' },
    { id: 3, type: 'Done' },
    { id: 4, type: 'Assigned' },
  ];

  const purposes = [
    { id: 1, purpose: 'Call' },
    { id: 2, purpose: 'Task' },
    { id: 3, purpose: 'Meeting' },
    { id: 4, purpose: 'Email' },
  ];

  await activityTypeRepo.save(activities);
  await activityPurposeRepo.save(purposes);

  console.log('Acticiy Filters Seeded Successfully!');
  await dataSource.destroy();
};

seed();
