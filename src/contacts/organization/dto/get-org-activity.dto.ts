// dto/get-org-activity.dto.ts
import { IsOptional, IsNumberString } from 'class-validator';

export class GetOrganizationActivityDto {
  @IsOptional()
  @IsNumberString()
  per_page?: number;

  @IsOptional()
  @IsNumberString()
  page?: number;
}
