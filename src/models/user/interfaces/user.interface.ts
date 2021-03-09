import { IUserDetail } from '../../userDetail/interfaces/user-detail.interface';

export interface IUser {
  username: string;
  password: string;
  details?: IUserDetail[];
}
