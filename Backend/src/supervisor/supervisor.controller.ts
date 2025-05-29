import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SupervisorService } from './supervisor.service';
import { Role } from 'src/common/enum';
import { RoleGuard } from 'src/common/guard/role.guard';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorator/getuser.decorator';
import { Supervisor } from '@prisma/client';
import { SupervisorUpdateDto } from 'src/common/dto';

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

  @Put()
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async updateSupervisor(
    @GetUser() userData: { user: Supervisor; role: Role },
    @Body() updateData: SupervisorUpdateDto,
  ): Promise<Supervisor> {
    return await this.supervisorService.updateSupervisorService(
      updateData,
      userData.user,
    );
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async deleteSupervisor(@Param('id') id: string): Promise<void> {
    return await this.supervisorService.deleteSupervisor(id);
  }

  @Get('stats')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async getStats(): Promise<any> {
    return await this.supervisorService.dashboardStats();
  }

  @Get('sessions/monthly')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async getMonthlySessions(): Promise<any> {
    return await this.supervisorService.countTotalVoteSessionsByMonth();
  }

  @Get('account-distribution')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async getAccountDistribution(): Promise<any> {
    return await this.supervisorService.userDistribution();
  }

  @Get('sessions-distribution')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async getSessionsDistribution(): Promise<any> {
    return await this.supervisorService.voteSessionDistribution();
  }
}
