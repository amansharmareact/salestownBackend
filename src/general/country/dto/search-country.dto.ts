import { IsOptional, IsString } from 'class-validator';

export class SearchCountryDto {
  @IsOptional()
  @IsString()
  search?: string;
}
