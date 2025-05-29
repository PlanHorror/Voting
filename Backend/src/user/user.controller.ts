import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Role } from 'src/common/enum';
import { GetUser } from 'src/common/decorator/getuser.decorator';
import { UserUpdateDto } from 'src/common/dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Get('count')
  async getUserCount(): Promise<number> {
    return this.userService.countUsers();
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.USER]))
  async getProfile(
    @GetUser() userData: { user: User; role: Role },
  ): Promise<User> {
    return this.userService.findUserById(userData.user.id);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.USER]))
  async updateUser(
    @GetUser() userData: { user: User; role: Role },
    @Body() updateData: UserUpdateDto,
  ): Promise<User> {
    return this.userService.updateUserService(updateData, userData.user);
  }
}
