import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { IncomeService } from './income.service';
import { CreateIncomeDto } from './dto/create-income.dto';
import { UpdateIncomeDto } from './dto/update-income.dto';
import { Response } from 'express';

@Controller('income')
export class IncomeController {
  constructor(private readonly incomeService: IncomeService) {}
  @Post()
  create(
    @Body() createIncomeDto: CreateIncomeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.incomeService.create(createIncomeDto, res.locals.user);
  }

  @Get()
  findAll(
    @Res({ passthrough: true }) res: Response,
    @Query('startAt') startAt?: string,
    @Query('endAt') endAt?: string,
  ) {
    return this.incomeService.findAll(startAt, endAt, res.locals.user);
  }
  // getting all details 
  @Get('/ledger')
  ledger(
    @Res({ passthrough: true }) res: Response,
    @Query('startAt') startAt?: string,
    @Query('endAt') endAt?: string,
  ) {
    return this.incomeService.getLedgerData(startAt,endAt,res.locals.user);
  }
  @Get(':id')
  findOne(
    @Param('id', ParseIntPipe) num: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.incomeService.findOne(num, res.locals.user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateIncomeDto: UpdateIncomeDto,
  ) {
    return this.incomeService.update(id, updateIncomeDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.incomeService.remove(id);
  }
}
