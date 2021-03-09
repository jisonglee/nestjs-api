import { Expose, Exclude } from 'class-transformer';
import { ModelEntity } from '@/common/serializers/model.serializer';
import { IUser } from '../interfaces/user.interface';
import { IUserDetail } from '../../userDetail/interfaces/user-detail.interface';

export const defaultUserGroupsForSerializing: string[] = ['user.timestamps'];

export const extendedUserGroupsForSerializing: string[] = [
  ...defaultUserGroupsForSerializing,
  'user.username',
  'user.detail',
];

export const allUserGroupsForSerializing: string[] = [
  ...extendedUserGroupsForSerializing,
  'user.password',
  'user.id',
];

export class UserEntity extends ModelEntity implements IUser {
  @Expose({ groups: ['user.id'] })
  id: number;

  uuid: string;

  @Expose({ groups: ['user.username'] })
  username: string;

  @Expose({ groups: ['user.password'] })
  password: string;

  @Expose({ groups: ['user.detail'] })
  details?: IUserDetail[];

  @Expose({ groups: ['user.timestamps'] })
  lastLoginedAt: Date;

  @Exclude()
  operator: string;

  @Expose({ groups: ['user.timestamps'] })
  createdAt: Date;

  @Expose({ groups: ['user.timestamps'] })
  updatedAt: Date;
}
