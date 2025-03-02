import { Controller, Post, Body, Get, Param, Put, Delete, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() body: { name: string; email: string; password: string }) {
    return this.usersService.createUser(body.name, body.email, body.password);
  }

  @Get(':id')
  async getUser(@Param('id') id: number) {
    return this.usersService.findById(id);
  }

  @Delete('delete')
  async deleteUser(@Body() body: { userId: number; password: string }) {
    if (!body.userId || !body.password) {
      throw new BadRequestException("User ID and password are required.");
    }
    return this.usersService.deleteUser(body.userId, body.password);
  }

  @Put(':id')
  async updateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }
}
