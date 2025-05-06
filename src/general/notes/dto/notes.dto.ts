import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class AddNoteDto {
  @IsOptional()
  @IsNumber()
  lead_id?: number;

  @IsOptional()
  @IsUUID()
  organization_id?: string;

  @IsOptional()
  @IsUUID()
  person_id?: string;

  @IsNotEmpty()
  @IsString()
  notes: string;
}
