import { ModelEntity } from '@/common/serializers/model.serializer';
import { Exclude, Expose } from 'class-transformer';
import { IVacation } from '../interfaces/vacation.interface';

export const defaultVacationGroupsForSerializing: string[] = [];

export const extendedVacationGroupsForSerializing: string[] = [
  ...defaultVacationGroupsForSerializing,
];

export const allVacationGroupsForSerializing: string[] = [
  ...extendedVacationGroupsForSerializing,
  'user.id',
  'vacation.timestamps',
];

export class VacationEntity extends ModelEntity implements IVacation {
  @Expose({ groups: ['user.id'] })
  id: number;

  uuid: string;

  year: string;

  startDt: Date;

  endDt: Date;

  numOfDays: number;

  comment?: string;

  @Exclude()
  userId: number;

  @Exclude()
  operator: string;

  @Expose({ groups: ['user.timestamps'] })
  createdAt: Date;

  @Expose({ groups: ['user.timestamps'] })
  updatedAt: Date;
}
