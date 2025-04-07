import { IsBoolean } from 'class-validator';

export class TogglePasswordChangeDto {
  @IsBoolean()
  can_change_password: boolean;
}
