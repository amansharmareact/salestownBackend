// src/product/dto/update-product.dto.ts

import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateProductDto {
  @IsString()
  product_name: string;

  @IsString()
  product_code: string;

  @IsOptional()
  @IsNumber()
  category_id?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsNumber()
  unit_price?: number;

  @IsOptional()
  @IsNumber()
  tax?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  custom_field_value?: any[];

  @IsOptional()
  custom_column_id?: any[];
}
