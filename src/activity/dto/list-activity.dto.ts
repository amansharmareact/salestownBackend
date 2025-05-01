import { IsOptional, IsNumberString, IsString } from 'class-validator';

export class ActivityFilterDto {
  @IsOptional()
  @IsNumberString()
  per_page?: number;

  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  user_id?: string;

  @IsOptional()
  @IsString()
  start_date?: string;

  @IsOptional()
  @IsString()
  end_date?: string;

  @IsOptional()
  @IsNumberString()
  activity_type?: number;

  @IsOptional()
  @IsNumberString()
  purpose?: number;
}
