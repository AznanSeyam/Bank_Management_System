import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()


  @Column({ unique: true })
  email: string;

  @Column()
  password: string; 

  @Column({ type: 'decimal', default: 1000.0 })
  balance: number;
  sentTransactions: any;
  receivedTransactions: any;
}
