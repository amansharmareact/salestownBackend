import { DataSource } from 'typeorm';
import { Category } from '../entities/category.entity';
import * as dotenv from 'dotenv';

dotenv.config();

const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT as string, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
   // entities: [ActivityPurpose,ActivityType], // entities here
   entities: ['src/**/*.entity{.ts,.js}'], 
    synchronize: true,
    ssl:{
      rejectUnauthorized:false,
    }
});

const seedCategories = async () => {
  await AppDataSource.initialize();
  const categoryRepo = AppDataSource.getRepository(Category);

  const categories = [
    'Laptop', 'tse', '4ere', 'sdsads', 'Hp', 'tset', '11',
    '45', 'Filtration Equipment', 'Filtration', 'test'
  ];

  for (const name of categories) {
    const exists = await categoryRepo.findOne({ where: { name } });
    if (!exists) {
      const category = categoryRepo.create({ name });
      await categoryRepo.save(category);
    }
  }

  console.log('✅ Categories seeded successfully');
  await AppDataSource.destroy();
};

seedCategories();
