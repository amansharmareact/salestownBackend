
import {
    IsString,
    IsOptional,
    IsArray,
    IsNumber,
    IsNotEmpty,
  } from 'class-validator';
  
  export class CreateOrganizationDto {
    @IsString()
    @IsNotEmpty()
    organization_name: string;
  
    @IsOptional()
    @IsString()
    country?: string;
  
    @IsOptional()
    @IsString()
    state?: string;
  
    @IsOptional()
    @IsString()
    city?: string;
  
    @IsOptional()
    @IsNumber()
    pincode?: number;
  
    @IsOptional()
    @IsString()
    address?: string;
  
    @IsOptional()
    @IsString()
    address_line_2?: string;
  
    @IsOptional()
    @IsString()
    gst?: string;
  
    @IsOptional()
    @IsString()
    pan?: string;
  
    @IsOptional()
    @IsString()
    website?: string;
  
    @IsOptional()
    @IsString()
    facebook?: string;
  
    @IsOptional()
    @IsString()
    linkedin?: string;
  
    @IsOptional()
    @IsString()
    instagram?: string;
  
    @IsOptional()
    @IsString()
    twitter?: string;
  
    @IsOptional()
    @IsArray()
    custom_field_value?: string[];
  
    @IsOptional()
    @IsArray()
    custom_column_id?: number[];
  
  }