import { User } from '@/models/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IVacation } from '../interfaces/vacation.interface';

@Entity({ name: 'vacation' })
export class Vacation implements IVacation {
  @PrimaryGeneratedColumn()
  id: number;

  @Index({ unique: true })
  @Column()
  uuid: string;

  @Column()
  year: string;

  @Column({ name: 'start_dt', type: 'date' })
  startDt: Date;

  @Column({ name: 'end_dt', type: 'date' })
  endDt: Date;

  @Column({ name: 'days' })
  numOfDays: number;

  @Column({ nullable: true })
  comment?: string;

  @Column({ name: 'user_id' })
  userId: number;

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

  isCancelable(now: Date): boolean {
    return new Date(this.startDt) >= now;
  }
}
