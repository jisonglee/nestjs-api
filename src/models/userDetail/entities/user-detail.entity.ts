import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryColumn,
  JoinColumn,
} from 'typeorm';
import { IUserDetail } from '../interfaces/user-detail.interface';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'user_detail' })
export class UserDetail implements IUserDetail {
  @PrimaryColumn({
    name: 'user_id',
  })
  userId: number;

  @PrimaryColumn()
  key: string;

  @Column()
  value: string;

  @ManyToOne(() => User, (user) => user.details, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user?: User;

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
