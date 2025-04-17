
import { UserListItemDto } from './user-list-item.dto';

export class UserListResponseDto {
  success: string;
  message: string;
  data: UserListItemDto[];
}
