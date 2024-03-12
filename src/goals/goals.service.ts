import { Injectable } from '@nestjs/common';
import { CreateGoalDto } from './dto/create-goal.dto';
import { UpdateGoalDto } from './dto/update-goal.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Goal } from './entities/goal.entity';
import { And, LessThan, MoreThan, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class GoalsService {
  constructor(
    @InjectRepository(Goal) private readonly goalRepository: Repository<Goal>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: number, createGoalDto: CreateGoalDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const goal = new Goal();
    goal.amount = createGoalDto.amount;
    goal.name = createGoalDto.name;
    goal.endDate = createGoalDto.endDate;
    goal.user = user;
    try {
      let savedGoal = this.goalRepository.save(goal);
      return savedGoal;
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
      return this.goalRepository.find({
        where: conditions.length
          ? { endDate: And(...conditions), user: { id: userId } }
          : { user: { id: userId } },
      });
    } catch (error) {
      return error.message;
    }
  }

  findOne(userId: number, id: number) {
    try {
      const goal = this.goalRepository.findOne({
        where: { user: { id: userId }, id: id },
      });
      return goal;
    } catch (error) {
      return error.message;
    }
  }

  update(id: number, updateGoalDto: UpdateGoalDto) {
    try {
      const updatedGoal = this.goalRepository.update(id, updateGoalDto);
      return updatedGoal;
    } catch (error) {
      return error.message;
    }
  }

  remove(id: number) {
    try {
      return this.goalRepository.delete(id);
    } catch (error) {
      return error.message;
    }
  }
}
