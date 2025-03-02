import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Transaction } from './entities/transaction.entity';
import { User } from '../users/entities/user.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionsRepository: Repository<Transaction>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    private readonly dataSource: DataSource,
  ) {}

  async transferMoney(transferDto: CreateTransactionDto) {
    const { senderId, receiverId, amount } = transferDto;

    console.log(` Transfer Request: ${amount} from Sender ${senderId} to Receiver ${receiverId}`);

    if (amount <= 0) {
      console.error(' Invalid transfer amount');
      throw new BadRequestException('Invalid transfer amount. Must be greater than zero.');
    }

    return this.dataSource.transaction(async (manager) => {
      const sender = await manager.findOne(User, { where: { id: senderId } });
      if (!sender) {
        console.error(' Sender not found');
        throw new NotFoundException('Sender not found');
      }

      const receiver = await manager.findOne(User, { where: { id: receiverId } });
      if (!receiver) {
        console.error(' Receiver not found');
        throw new NotFoundException('Receiver not found');
      }

      console.log(` Sender Balance Before: ${sender.balance}`);
      console.log(` Receiver Balance Before: ${receiver.balance}`);

      if (sender.balance < amount) {
        console.error(' Insufficient funds');
        throw new BadRequestException('Insufficient balance');
      }

      const transferAmount = Number(amount);
      if (isNaN(transferAmount)) {
        throw new BadRequestException('Invalid transaction amount format');
      }

      sender.balance = Number(sender.balance) - transferAmount;
      receiver.balance = Number(receiver.balance) + transferAmount;

      await manager.save(sender);
      await manager.save(receiver);

      const transaction = manager.create(Transaction, {
        sender,
        receiver,
        amount: transferAmount, 
        createdAt: new Date(),
      });
      await manager.save(transaction);

      console.log(` Transfer Completed: ${transferAmount} from ${sender.name} to ${receiver.name}`);
      console.log(` Updated Sender Balance: ${sender.balance}`);
      console.log(` Updated Receiver Balance: ${receiver.balance}`);

      return {
        message: 'Transaction successful!',
        senderName: sender.name,
        receiverName: receiver.name,
        receiverEmail: receiver.email,
        senderNewBalance: sender.balance,
        receiverNewBalance: receiver.balance,
        amountTransferred: transferAmount,
        transactionDate: transaction.createdAt.toISOString(),
      };
    });
  }

  async getTransferHistory(userId: number) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const transactions = await this.transactionsRepository.find({
      where: [{ sender: user }, { receiver: user }],
      relations: ['sender', 'receiver'],
      order: { createdAt: 'DESC' }, 
    });

    return transactions.map((transaction) => ({
      senderId: transaction.sender.id,
      senderName: transaction.sender.name,
      senderEmail: transaction.sender.email,
      receiverId: transaction.receiver.id, 
      receiverName: transaction.receiver.name,
      receiverEmail: transaction.receiver.email,
      senderAmountSent: transaction.amount,
      receiverAmountReceived: transaction.amount,
      transactionDate: transaction.createdAt.toISOString(),
    }));
}

}
