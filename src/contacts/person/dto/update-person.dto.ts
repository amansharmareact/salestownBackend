// src/contacts/person/dto/update-person.dto.ts
import {
    IsArray,
    IsNumber,
    IsOptional,
    IsString,
  } from 'class-validator';
  
  export class UpdatePersonDto {
    @IsString()
    person_name: string;
  
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
  
    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    custom_column_value_id?: number[];
  
    @IsOptional()
    @IsNumber()
    owner?: number;
  }
  