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
export class Expense {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  type: string;
  @Column()
  amount: number;
  @Column()
  spendAt: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  // Temporary foreign key fro many to one relation
  // @Column()
  // owner: number;
  @ManyToOne(() => User, (user) => user.expenses, { onDelete: 'CASCADE' })
  user: User;
}
