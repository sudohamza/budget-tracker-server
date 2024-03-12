import { Expense } from 'src/expense/entities/expense.entity';
import { Goal } from 'src/goals/entities/goal.entity';
import { Income } from 'src/income/entities/income.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  fullName: string;
  @Column({ unique: true })
  email: string;
  @CreateDateColumn()
  createdAt: Date;
  @Column()
  passwordHash: string;
  @Column({ default: 'email' })
  provider: string;
  @OneToMany(() => Income, (income) => income.user)
  incomes: [];
  @OneToMany(() => Expense, (expense) => expense.user)
  expenses: [];
  @OneToMany(() => Goal, (goal) => goal.user)
  goals: [];
}
