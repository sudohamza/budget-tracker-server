import { Injectable } from '@nestjs/common';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { And, LessThan, MoreThan, Repository } from 'typeorm';
import { Expense } from './entities/expense.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ExpenseService {
  constructor(
    @InjectRepository(Expense)
    private readonly expenseRepository: Repository<Expense>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(userId: number, createExpenseDto: CreateExpenseDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const expense = new Expense();
    expense.type = createExpenseDto.type;
    expense.amount = createExpenseDto.amount;
    expense.spendAt = createExpenseDto.spendAt;
    expense.user = user;
    try {
      const savedExpense = this.expenseRepository.save(expense);
      return savedExpense;
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
      return this.expenseRepository.find({
        where: conditions.length
          ? { spendAt: And(...conditions), user: { id: userId } }
          : { user: { id: userId } },
      });
    } catch (error) {
      return error.message;
    }
  }

  findOne(userId: number, id: number) {
    try {
      const expense = this.expenseRepository.findOne({
        where: { user: { id: userId }, id: id },
      });
      return expense;
    } catch (error) {
      return error.message;
    }
  }

  update(id: number, updateExpenseDto: UpdateExpenseDto) {
    try {
      const updatedExpense = this.expenseRepository.update(
        id,
        updateExpenseDto,
      );
      return updateExpenseDto;
    } catch (error) {
      return error.message;
    }
  }

  remove(id: number) {
    try {
      return this.expenseRepository.delete(id);
    } catch (error) {
      return error.message;
    }
  }
}
