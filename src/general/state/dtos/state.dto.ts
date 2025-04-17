import { IsOptional, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetStatesDto {
  @IsOptional()          // Makes the field optional
  @IsInt()               // Validates that the field is an integer
  @Type(() => Number)    // Transforms the field to a number
  countryId?: number;    // countryId is optional
}
