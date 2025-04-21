// src/leads/dto/update-lead.dto.ts

import { IsOptional, IsArray, IsString, IsNumber, IsDateString } from 'class-validator';

export class UpdateLeadDto {
  @IsOptional()
  @IsString()
  organization_name?: string;

  @IsOptional()
  @IsString()
  person_name?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsNumber()
  value?: number;

  @IsOptional()
  @IsNumber()
  pipeline_id?: number;

  @IsOptional()
  @IsNumber()
  pipestage_id?: number;

  @IsOptional()
  @IsDateString()
  expected_close_date?: string;

  @IsOptional()
  @IsNumber()
  can_view?: number; // 1 or 2

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  email?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  phone?: string[];

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
  @IsNumber()
  owner?: number;

  //@IsOptional()
  //@IsNumber()
  //owner?: string;
  
  @IsOptional()
  @IsString()
  won_probability?: string;

  @IsOptional()
  @IsArray()
  custom_field_value?: string[];

  @IsOptional()
  @IsArray()
  custom_column_id?: number[];
}

  