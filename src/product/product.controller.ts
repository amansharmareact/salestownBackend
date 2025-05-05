import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/filter')
  @UseGuards(JwtAuthGuard)
  async getProductFilters() {
    const category = await this.productService.getAllCategories();
    return {
      success: 'true',
      message: 'Product Filters',
      category,
    };
  }

  
  @UseGuards(JwtAuthGuard)
  @Post('add')
  async createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  
  @UseGuards(JwtAuthGuard)
  @Get('form')
  async getProductForm() {
    return this.productService.getProductForm();
  }


@UseGuards(JwtAuthGuard)
@Patch('update/:product_id')
async updateProduct(
  @Param('product_id') product_id: number,
  @Body() body: UpdateProductDto,
) {
  return this.productService.updateProduct(+product_id, body);
}


@UseGuards(JwtAuthGuard)
@Delete('delete/:product_id')
async deleteProduct(@Param('product_id') product_id: number) {
  return this.productService.deleteProduct(+product_id);
}


@UseGuards(JwtAuthGuard)
@Get('search')
async searchProducts(
  @Query() queryParams: any,
  @Body() bodyParams: any,
) {
  const { search, per_page, page } = {
    ...bodyParams,
    ...queryParams,
  };

  return this.productService.searchProducts(search, per_page, page);
}

// src/product/product.controller.ts

@UseGuards(JwtAuthGuard)
@Get('view/:product_id')
async viewProduct(@Param('product_id') productId: number) {
  return this.productService.viewProduct(productId);
}

@Get()
@UseGuards(JwtAuthGuard)
async getAllProducts(
  @Query() query: any,
): Promise<any> {
  return this.productService.getAllProducts(query);
}



}