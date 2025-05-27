import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { VoteSessionService } from './vote-session.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Role } from 'src/common/enum';
import { GetUser } from 'src/common/decorator/getuser.decorator';
import { Supervisor } from '@prisma/client';
import { VoteSessionCreateDto } from 'src/common/dto/vote-session.dto';

@Controller('session')
export class VoteSessionController {
  constructor(private voteSessionService: VoteSessionService) {}

  @Get('all')
  async getAllVoteSessions() {
    return this.voteSessionService.getVoteSession();
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async getVoteSession(@GetUser() userData: { user: Supervisor; role: Role }) {
    return this.voteSessionService.getVoteSessionBySupervisorId(userData.user);
  }

  // @Get('find/:id')
  // @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  // async getVoteSessionById(
  //   @GetUser() userData: { user: Supervisor; role: Role },
  //   @Param('id') id: string,
  // ) {
  //   return this.voteSessionService.findVoteSessionById(id, userData.user);
  // }

  @Get('find/:id')
  async getVoteSessionById(@Param('id') id: string) {
    return this.voteSessionService.getVoteSessionById(id);
  }
  @Post()
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async createVoteSession(
    @GetUser() userData: { user: Supervisor; role: Role },
    @Body() data: VoteSessionCreateDto,
  ) {
    return this.voteSessionService.createVoteSessionService(
      data,
      userData.user,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async updateVoteSession(
    @GetUser() userData: { user: Supervisor; role: Role },
    @Param('id') id: string,
    @Body() data: VoteSessionCreateDto,
  ) {
    return this.voteSessionService.updateVoteSessionService(
      id,
      data,
      userData.user,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async deleteVoteSession(
    @GetUser() userData: { user: Supervisor; role: Role },
    @Param('id') id: string,
  ) {
    return this.voteSessionService.deleteVoteSessionService(id, userData.user);
  }
}
