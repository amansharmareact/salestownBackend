import { IsOptional, IsNumber } from "class-validator";

export class LeadListDto {
    @IsOptional()
    @IsNumber()
    per_page?: number;
  
    @IsOptional()
    @IsNumber()
    page?: number;
  }
  