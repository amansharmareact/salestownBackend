
import { IsArray, IsBoolean, IsOptional, IsString } from 'class-validator';

export class ActivityReportFormDto {
  @IsOptional()
  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  name: string;

  @IsOptional()
  @IsBoolean()
  is_required: boolean;

  @IsOptional()
  @IsArray()
  custom: any[];
}
