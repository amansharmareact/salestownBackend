// leads/dto/lead-lost.dto.ts

import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class LeadLostDto {
  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsNotEmpty()
  @IsNumber()
  reason_id: number;

  @IsOptional()
  @IsString()
  subreason?: string;

  @IsOptional()
  @IsNumber()
  subreason_id?: number;

  @IsOptional()
  @IsString()
  comment?: string;
}
