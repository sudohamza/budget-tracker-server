import { Module } from '@nestjs/common';
import { IncomeService } from './income.service';
import { IncomeController } from './income.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { User } from 'src/users/entities/user.entity';
import { Expense } from 'src/expense/entities/expense.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Income]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Expense]),
  ],
  controllers: [IncomeController],
  providers: [IncomeService],
})
export class IncomeModule {}
