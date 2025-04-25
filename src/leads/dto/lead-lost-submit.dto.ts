import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class LeadLostSubmitDto {
  @IsNotEmpty()
  @IsNumber()
  reason: number;

  @IsNotEmpty()
  @IsNumber()
  sub_reason: number;

  @IsOptional()
  @IsString()
  comment: string;
}

