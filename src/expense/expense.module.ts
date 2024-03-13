import { Module } from '@nestjs/common';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { User } from 'src/users/entities/user.entity';
import { Income } from 'src/income/entities/income.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Expense, User, Income])],
  controllers: [ExpenseController],
  providers: [ExpenseService],
})
export class ExpenseModule {}
