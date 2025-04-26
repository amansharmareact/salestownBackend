// src/seeds/state.seed.ts
import { DataSource } from 'typeorm';
import { State } from '../state/entities/state.entity';
import { Country } from '../country/entities/country.entity';
import { City } from '../city/entities/city.entity';

import * as dotenv from 'dotenv';

dotenv.config();


const dataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT as string, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [State,Country,City],
    synchronize: false, 
    logging: true,
    ssl:{
      rejectUnauthorized:false,
    }
});

const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
];

async function seedStates() {
  await dataSource.initialize();

  const countryRepo = dataSource.getRepository(Country);
  const stateRepo = dataSource.getRepository(State);

  const india = await countryRepo.findOneBy({ name: 'India' });

  if (!india) {
    console.error('India not found in Country table.');
    return;
  }

  for (const stateName of indianStates) {
    const state = new State();
    state.name = stateName;
    state.country = india;
    await stateRepo.save(state);
  }

  console.log('Indian states seeded successfully!');
  process.exit(0);
}

seedStates();
  