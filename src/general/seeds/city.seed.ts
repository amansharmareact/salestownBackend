// src/seeds/city.seed.ts
import { DataSource } from 'typeorm';
import { City } from '../city/entities/city.entity';
import { State } from '../state/entities/state.entity';
import { Country } from '../country/entities/country.entity';
import * as dotenv from 'dotenv';
dotenv.config(); 


const dataSource = new DataSource({
 type: 'postgres',
   host: process.env.DB_HOST || 'localhost',
   port: parseInt(process.env.DB_PORT as string, 10),
   username: process.env.DB_USER,
   password: process.env.DB_PASS,
   database: process.env.DB_NAME,
   entities: [Country,State,City], // entities here
   synchronize: false, // Keep false to avoid auto-syncing during script execution
});

const indianCities = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
  'Uttar Pradesh': ['Noida , Meerut , Baghpat'],
  // Add more states and their cities here
};

async function seedCities() {
  await dataSource.initialize();

  const stateRepo = dataSource.getRepository(State);
  const cityRepo = dataSource.getRepository(City);

  // Loop through each state to add cities
  for (const [stateName, cities] of Object.entries(indianCities)) {
    const state = await stateRepo.findOne({ where: { name: stateName } });

    if (!state) {
      console.error(`State ${stateName} not found.`);
      continue;
    }

    for (const cityName of cities) {
      const city = new City();
      city.name = cityName;
      city.state = state;
      await cityRepo.save(city);
    }
  }

  console.log('Cities seeded successfully!');
  process.exit(0);
}

seedCities();
