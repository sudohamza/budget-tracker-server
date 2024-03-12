import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity()
export class Income {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  source: string;
  @Column()
  amount: number;
  @Column()
  receivedAt: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  // temporary foreign key for many to one relation
  // @Column()
  // owner: number;
  @ManyToOne(() => User, (user) => user.incomes, { onDelete: 'CASCADE' })
  user: User;
}
