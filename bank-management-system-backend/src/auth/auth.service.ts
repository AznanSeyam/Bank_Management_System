import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { EmailService } from './email.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private readonly emailService: EmailService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ message: string; userId?: number }> {
    const { name, email, password } = registerDto;

    const existingUser = await this.usersRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    const newUser = this.usersRepository.create({ name, email, password, balance: 1000 });
    await this.usersRepository.save(newUser);

    await this.emailService.sendRegistrationEmail(email, name);

    return {
      message: 'Registration successful. A confirmation email has been sent.',
      userId: newUser.id,
    };
  }

  async login(loginDto: LoginDto): Promise<{ message: string; userId?: number }> {
    const { email, password } = loginDto;
    
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user || user.password !== password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      message: 'Login successful',
      userId: user.id,
    };
  }
}
