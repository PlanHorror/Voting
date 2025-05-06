import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Role } from 'src/common/enum';
import { GetUser } from 'src/common/decorator/getuser.decorator';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  async getAllUsers(): Promise<User[]> {
    return this.userService.findAllUsers();
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.USER]))
  async getProfile(
    @GetUser() userData: { user: User; role: Role },
  ): Promise<User> {
    return this.userService.findUserById(userData.user.id);
  }
}
