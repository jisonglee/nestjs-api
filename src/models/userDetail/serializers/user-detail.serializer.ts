import { Expose, Exclude } from 'class-transformer';
import { IUserDetail } from '../interfaces/user-detail.interface';

export const defaultUserDetailGroupsForSerializing: string[] = [];

export const allUserDetailGroupsForSerializing: string[] = [
  ...defaultUserDetailGroupsForSerializing,
  'user.timestamps',
];

export class UserDetailEntity implements IUserDetail {
  @Exclude()
  userId: number;

  key: string;

  value: string;

  @Exclude()
  operator: string;

  @Expose({ groups: ['user.timestamps'] })
  createdAt: Date;

  @Expose({ groups: ['user.timestamps'] })
  updatedAt: Date;
}
