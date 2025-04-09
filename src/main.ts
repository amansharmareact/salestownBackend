import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
dotenv.config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //By Enabling ValidationPipe main file has global validation enabled 
 // so DTO decorators like @IsString() work:
 app.useGlobalPipes(new ValidationPipe());



  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
