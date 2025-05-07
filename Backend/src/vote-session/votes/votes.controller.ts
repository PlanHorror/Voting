import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { VotesService } from './votes.service';
import { AuthGuard } from '@nestjs/passport';
import { Role } from 'src/common/enum';
import { RoleGuard } from 'src/common/guard/role.guard';
import { GetUser } from 'src/common/decorator/getuser.decorator';
import { User } from '@prisma/client';
import { UseVoteDto } from 'src/common/dto/vote.dto';

@Controller('votes')
export class VotesController {
  constructor(private votesService: VotesService) {}

  @Get('all')
  async getAllVotes() {
    return await this.votesService.getAllVotes();
  }

  @Get('session/:id')
  async getVotesByVoteSessionId(id: string) {
    return await this.votesService.getVotesByVoteSessionId(id);
  }

  @Post('session/:id')
  async vote(@Body() data: UseVoteDto, @Param('id') id: string) {
    await this.votesService.voteService(data, id);
  }
}
