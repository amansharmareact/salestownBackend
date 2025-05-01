// leads/dto/get-leads.dto.ts
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class GetLeadsDto {
  @IsOptional()
  @IsNumber()
  per_page?: number = 10;

  @IsOptional()
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  pipeline_id?: string;

  @IsOptional()
  @IsString()
  pipestage_id?: string;

  @IsOptional()
  @IsString()
  lead_type?: string;

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
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @IsString()
  update_start_date?: string;

  @IsOptional()
  @IsString()
  update_end_date?: string;
}