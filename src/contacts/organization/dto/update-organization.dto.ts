
import {
    IsString,
    IsOptional,
    IsArray,
    IsNumber,
  } from 'class-validator';
  
  export class UpdateOrganizationDto {
    @IsOptional()
    @IsString()
    organization_name?: string;
  
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
  
    @IsOptional()
    @IsArray()
    custom_column_value_id?: number[];
  
    @IsOptional()
    @IsNumber()
    owner?: number;
  }
  