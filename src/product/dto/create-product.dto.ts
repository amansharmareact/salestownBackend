// src/product/dto/create-product.dto.ts

import {
    IsString,
    IsNumber,
    IsOptional,
    IsArray,
    IsNotEmpty,
  } from 'class-validator';
  
  export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    product_name: string;
  
    @IsString()
    @IsNotEmpty()
    product_code: string;
  
    @IsNumber()
    @IsOptional()
    category_id?: number;
  
    @IsString()
    @IsOptional()
    unit?: string;
  
    @IsNumber()
    @IsOptional()
    unit_price?: number;
  
    @IsNumber()
    @IsOptional()
    tax?: number;
  
    @IsNumber()
    @IsOptional()
    stock?: number;
  
    @IsString()
    @IsOptional()
    description?: string;
  
    @IsString()
    @IsOptional()
    thumbnail?: string;
  
    @IsArray()
    @IsOptional()
    custom_field_value?: any[];
  
    @IsArray()
    @IsOptional()
    custom_column_id?: any[];
  }
  