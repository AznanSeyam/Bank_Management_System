import { IsNumber, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  senderId: number;

  @IsNumber()
  receiverId: number;

  @IsNumber()
  @Min(1, { message: 'Amount must be at least 1' })
  amount: number;
}
