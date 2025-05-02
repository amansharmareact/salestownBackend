import { IsOptional, IsNumberString } from 'class-validator';

export class GetPersonActivityDto {
  @IsOptional()
  @IsNumberString()
  per_page?: number;

  @IsOptional()
  @IsNumberString()
  page?: number;
}
