import {
    IsString, IsOptional, IsNotEmpty, IsNumber, IsDateString, Matches,
    isString,
  } from 'class-validator';
  
  export class CreateActivityDto {
    @IsNumber()
    purpose: number;

    @IsNumber()
    type: number;
  
    @IsString()
    @IsNotEmpty()
    activity_title: string;
  
    @IsDateString()
    date: string;
  
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    from_time: string;
  
    @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
    to_time: string;
  
    @IsOptional()
    @IsString()
    activity_note?: string;
  
    @IsOptional()
    @IsNumber()
    lead_id?: number;
  
    @IsOptional()
    @IsString()
    person_id?: number;
  
    @IsOptional()
    @IsString()
    organization_id?: string;
  
    @IsOptional()
    @IsNumber()
    mark_done?: number;
  
    @IsOptional()
    @IsString()
    report?: string;
  
    @IsOptional()
    @IsString()
    owner?: string;

    @IsOptional()
    @IsDateString()
    updated_at?: Date;
  
    @IsOptional()
    @IsDateString()
    completed_at?: Date;
  }
  