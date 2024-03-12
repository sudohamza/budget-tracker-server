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
export class Goal {
  @PrimaryGeneratedColumn('increment')
  id: number;
  @Column()
  name: string;
  @Column()
  amount: number;
  @Column()
  endDate: string;
  @CreateDateColumn()
  createdAt: Date;
  @UpdateDateColumn()
  updatedAt: Date;
  // temporary foreign key for many to one relation
  // @Column()
  // owner: number;
  @ManyToOne(() => User, (user) => user.goals, { onDelete: 'CASCADE' })
  user: User;
}
