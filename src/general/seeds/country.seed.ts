import { DataSource } from 'typeorm';
import { Country } from '../country/entities/country.entity';
import * as dotenv from 'dotenv';
dotenv.config(); 


// Initialize the DataSource (TypeORM)
const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT as string, 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Country], // entities here
  synchronize: false, // Keep false to avoid auto-syncing during script execution
});

const seedCountries = async () => {
  // Initialize TypeORM
  await AppDataSource.initialize();
  const countryRepo = AppDataSource.getRepository(Country);

  const countries = [
    {
      name: 'India',
      phonecode: 91,
      shortname: 'IN',
      flag: 'https://app.salestown.in/assets/flags/in.png',
    },
    {
      name: 'United States',
      phonecode: 1,
      shortname: 'US',
      flag: 'https://app.salestown.in/assets/flags/us.png',
    },
    {
      name: 'United Kingdom',
      phonecode: 44,
      shortname: 'GB',
      flag: 'https://app.salestown.in/assets/flags/gb.png',
    },
    {
      name: 'Australia',
      phonecode: 61,
      shortname: 'AU',
      flag: 'https://app.salestown.in/assets/flags/au.png',
    },
  ];

  // Save country data
  for (const country of countries) {
    const exists = await countryRepo.findOneBy({ name: country.name });
    if (!exists) {
      await countryRepo.save(country);
    }
  }

  console.log('✅ Country data seeded!');
  await AppDataSource.destroy();
};

seedCountries();
