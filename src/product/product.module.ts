import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Category } from './entities/category.entity';
import { JwtModule } from '@nestjs/jwt';
import { User } from 'src/auth/entities/user.entity';
import { Product } from './entities/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category,User,Product]),JwtModule.register({}),],
  providers: [ProductService],
  controllers: [ProductController],
})
export class ProductModule {}
