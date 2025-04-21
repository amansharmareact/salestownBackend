// src/organization/dto/list-organization.dto.ts
import { IsOptional, IsString, IsNumber, IsUUID } from 'class-validator';

export class ListOrganizationDto {
  @IsOptional()
  @IsNumber()
  per_page?: number;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsUUID()
  user_id?: number;

  @IsOptional()
  @IsString()
  start_date?: string; 

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  city?: string;
}