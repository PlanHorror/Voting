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
import { CandidatesService } from './candidates.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/common/guard/role.guard';
import { GetUser } from 'src/common/decorator/getuser.decorator';
import { Supervisor } from '@prisma/client';
import { Role } from 'src/common/enum';
import { CandidateDto } from 'src/common/dto/candidate.dto';

@Controller('vote-session/candidates')
export class CandidatesController {
  constructor(private candidateService: CandidatesService) {}

  @Get('all')
  async getAllCandidates() {
    return await this.candidateService.findAllCandidates();
  }

  @Get()
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async getAllCandidatesByVoteSessionId(
    @GetUser() userData: { user: Supervisor; role: Role },
  ) {
    return await this.candidateService.findCandidateBySupervisorId(
      userData.user.id,
    );
  }

  @Get('/find/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async getCandidateById(
    @GetUser() userData: { user: Supervisor; role: Role },
    @Param('id') id: string,
  ) {
    return await this.candidateService.findCandidatesByIdService(
      id,
      userData.user.id,
    );
  }

  @Get('vote-session/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async getCandidatesByVoteSessionId(
    @GetUser() userData: { user: Supervisor; role: Role },
    @Param('id') id: string,
  ) {
    return await this.candidateService.findCandidatesByVoteSessionIdService(
      id,
      userData.user.id,
    );
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async createCandidate(
    @GetUser() userData: { user: Supervisor; role: Role },
    @Body() data: CandidateDto,
  ) {
    return await this.candidateService.createCandidateService(
      data,
      userData.user.id,
    );
  }

  @Put(':id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async updateCandidate(
    @GetUser() userData: { user: Supervisor; role: Role },
    @Param('id') id: string,
    @Body() data: CandidateDto,
  ) {
    return await this.candidateService.updateCandidateService(
      id,
      data,
      userData.user.id,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async deleteCandidate(
    @GetUser() userData: { user: Supervisor; role: Role },
    @Param('id') id: string,
  ) {
    return await this.candidateService.deleteCandidateService(
      id,
      userData.user.id,
    );
  }
  @Delete('vote-session/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async deleteAllCandidatesByVoteSessionId(
    @GetUser() userData: { user: Supervisor; role: Role },
    @Param('id') id: string,
  ) {
    return await this.candidateService.deleteAllCandidatesByVoteSessionId(
      id,
      userData.user.id,
    );
  }
}
