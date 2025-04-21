import { IsNotEmpty, IsString, IsArray, IsOptional, IsNumber, IsDateString } from 'class-validator';

export class CreateLeadDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  organization_name: string;

  @IsNotEmpty()
  @IsString()
  organization_id: string;

  @IsNotEmpty()
  @IsString()
  person_name: string;

  @IsNotEmpty()
  @IsString()
  person_id: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;

  @IsNotEmpty()
  @IsNumber()
  pipeline_id: number;

  @IsNotEmpty()
  @IsNumber()
  pipestage_id: number;

  @IsNotEmpty()
  @IsDateString()
  expected_close_date: string;

  @IsOptional()
  @IsNumber()
  can_view?: number;

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
  @IsArray()
  custom_field_value?: any[];

  @IsOptional()
  @IsArray()
  custom_column_id?: any[];
}
