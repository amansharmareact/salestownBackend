import { IsArray, IsOptional, IsString } from 'class-validator';

export class SubmitReportDto {
  @IsString()
  report: string;

  @IsArray()
  @IsOptional()
  custom_field_value: string[];

  @IsArray()
  @IsOptional()
  custom_column_id: number[];
}
