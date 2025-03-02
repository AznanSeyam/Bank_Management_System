import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('transfer')
  async transferMoney(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.transferMoney(createTransactionDto);
  }

  @Get('history/:userId')
  async getTransferHistory(@Param('userId') userId: number) {
    return this.transactionsService.getTransferHistory(userId);
  }
}
