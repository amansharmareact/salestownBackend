
import {
    IsArray,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
  } from 'class-validator';
  
  export class CreatePersonDto {
    @IsString()
    @IsNotEmpty()
    person_name: string;
  
    @IsString()
    @IsNotEmpty()
    organization_name: string;
  
    @IsUUID()
    @IsNotEmpty()
    organization_id: string;
  
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
    department?: string;
  
    @IsOptional()
    @IsString()
    designation?: string;
  
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    custom_field_value?: string[];
  
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    custom_column_id?: number[];
  }
  