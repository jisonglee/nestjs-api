import { CreateOrUpdateUserDetailDao } from '@/models/userDetail/dto/user-detail.dao';

export class CreateUserDto {
  username: string;
  password: string;
  details?: CreateOrUpdateUserDetailDao[];
}

export class UpdateUserDto {
  password?: string;
  details?: CreateOrUpdateUserDetailDao[];
}

export class LoginUserDto {
  lastLoginedAt?: Date;
}
