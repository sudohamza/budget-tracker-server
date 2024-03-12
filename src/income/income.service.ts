import { Injectable } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Income } from './entities/income.entity';
import { Repository, MoreThan, LessThan, And } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Expense } from 'src/expense/entities/expense.entity';

@Injectable()
export class IncomeService {
  constructor(
    @InjectRepository(Income)
    private readonly incomeRepository: Repository<Income>,
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(CreateIncomeDto: CreateIncomeDto, id: number): Promise<Income> {
    const user = await this.userRepository.findOne({ where: { id: id } });
    const income = new Income();
    income.source = CreateIncomeDto.source;
    income.amount = CreateIncomeDto.amount;
    income.receivedAt = CreateIncomeDto.receivedAt;
    income.user = user;
    try {
      const currentIncome = await this.incomeRepository.save(income);
      return currentIncome;
    } catch (error) {
      return error.message;
    }
  }

  findOne(recordId: number, userId: number) {
    try {
      const income = this.incomeRepository.findOne({
        // changed recently !!!! for testing
        where: { user: { id: userId }, id: recordId },
      });
      return income;
    } catch (error) {
      return error.message;
    }
  }

  update(id: number, updateIncomeDto: UpdateIncomeDto) {
    try {
      const updatedIncome = this.incomeRepository.update(id, updateIncomeDto);
      return updatedIncome;
    } catch (error) {
      return error.message;
    }
  }

  remove(id: number) {
    try {
      return this.incomeRepository.delete(id);
    } catch (error) {
      return error.message;
    }
  }

  async findAll(startAt: string, endAt: string, userId: number) {
    try {
      const conditions = [];
      if (startAt) {
        conditions.push(MoreThan(new Date(startAt)));
      }
      if (endAt) {
        conditions.push(LessThan(new Date(endAt)));
      }
      return this.incomeRepository.find({
        where: conditions.length
          ? { receivedAt: And(...conditions), user: { id: userId } }
          : { user: { id: userId } },
      });
    } catch (error) {
      return error.message;
    }
  }
  async getLedgerData(startAt: string, endAt: string, userId: number) {
    try {
      // creating conditions if user send a specific date range
      const conditions = [];
      if (startAt) {
        conditions.push(MoreThan(new Date(startAt)));
      }
      if (endAt) {
        conditions.push(LessThan(new Date(endAt)));
      }
      // find all income according to userId
      const incomes = await this.incomeRepository.find({
        where: conditions.length
          ? { receivedAt: And(...conditions), user: { id: userId } }
          : { user: { id: userId } },
      });
      // find all expenses according to userId
      const expenses = await this.expenseRepository.find({
        where: conditions.length
          ? { spendAt: And(...conditions), user: { id: userId } }
          : { user: { id: userId } },
      });
      // normalizing the data
      const modifiedIncomes = incomes.map((item) => {
        return {
          id: item.id,
          type: 'income',
          title: item.source,
          amount: item.amount,
          date: item.receivedAt,
        };
      });
      const modifiedExpenses = expenses.map((item) => {
        return {
          id: item.id,
          type: 'expense',
          title: item.type,
          amount: item.amount,
          date: item.spendAt,
        };
      });
      // combining both incomes and expenses
      const ledger = [...modifiedIncomes, ...modifiedExpenses];
      // sorting by date
      ledger.sort(
        (a, b) => Number(new Date(a.date)) - Number(new Date(b.date)),
      );
      return ledger;
    } catch (error) {
      return { message: 'Error in ledger', error };
    }
  }
}
