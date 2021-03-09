import {
  Entity,
  Column,
  CreateDateColumn,
  Index,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { IUser } from '../interfaces/user.interface';
import { UserDetail } from '../../userDetail/entities/user-detail.entity';
import { Vacation } from '@/models/vacation/entities/vacation.entity';

@Entity({ name: 'user' })
export class User implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  uuid: string;

  @Index({ unique: true })
  @Column()
  username: string;

  @Column()
  password: string;

  @Column({
    name: 'last_logined_at',
    type: 'timestamp',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  lastLoginedAt?: Date;

  @OneToMany(() => UserDetail, (userDetail) => userDetail.user, {
    cascade: true,
  })
  details: UserDetail[];

  @Column({ nullable: true })
  operator?: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
