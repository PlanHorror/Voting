import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ParticipantService } from './participant.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/common/guard/role.guard';
import { Role } from 'src/common/enum';
import { GetUser } from 'src/common/decorator/getuser.decorator';
import { Signer, Supervisor, User } from '@prisma/client';

@Controller('participant')
export class ParticipantController {
  constructor(private participantService: ParticipantService) {}

  @Get('all')
  async getAllParticipant() {
    return await this.participantService.getAllParticipant();
  }

  @Get('vote-session/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR, Role.SIGNER]))
  async getAllParticipantByVoteSessionId(
    @Param('id') id: string,
    @GetUser() userData: { user: Supervisor | Signer; role: Role },
  ) {
    return await this.participantService.getAllParticipantByVoteSessionService(
      id,
      userData.user.id,
      userData.role,
    );
  }

  // @Get('user/:id')
  // @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.USER]))
  // async getParticipantByUserId(
  //   @Param('id') id: string,
  //   @GetUser() userData: { user: Supervisor | Signer; role: Role },
  // ) {
  //   return await this.participantService.getParticipantByUserIdService(
  //     id,
  //     userData.user.id,
  //     userData.role,
  //   );
  // }

  @Post('vote-session/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.USER]))
  async createParticipant(
    @Param('id') id: string,
    @GetUser() userData: { user: User; role: Role },
  ) {
    return await this.participantService.createParticipantService(
      userData.user.id,
      id,
    );
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SIGNER]))
  async deleteParticipant(
    @Param('id') id: string,
    @GetUser() userData: { user: Signer; role: Role },
  ) {
    return await this.participantService.deleteParticipantService(
      id,
      userData.user.id,
    );
  }
}
