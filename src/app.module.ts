import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { User } from './auth/entities/user.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),  // Loads environment variables
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT as string, 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'root',
      database: process.env.DB_NAME || 'authdb',
      entities: [User],
      ssl: {
        rejectUnauthorized: false, // ← required for Render
      },
      autoLoadEntities: true,
      synchronize: false,  // Auto-creates tables (Only for development)
    }),
    AuthModule,
  ],
})
export class AppModule {}
