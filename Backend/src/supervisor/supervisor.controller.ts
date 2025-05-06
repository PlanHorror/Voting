import { Controller, Get, UseGuards } from '@nestjs/common';
import { SupervisorService } from './supervisor.service';
import { Role } from 'src/common/enum';
import { RoleGuard } from 'src/common/guard/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorator/getuser.decorator';
import { Supervisor } from '@prisma/client';

@Controller('supervisor')
export class SupervisorController {
  constructor(private supervisorService: SupervisorService) {}

  @Get()
  async getAllSupervisors(): Promise<Supervisor[]> {
    return await this.supervisorService.findAllSupervisors();
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async getProfile(
    @GetUser() userData: { user: Supervisor; role: Role },
  ): Promise<Supervisor> {
    return await this.supervisorService.findSupervisorById(userData.user.id);
  }
}
