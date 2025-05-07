import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { VoteSessionModule } from '../vote-session.module';
import { VotesModule } from '../votes/votes.module';
import { PrismaService } from 'src/prisma.service';
import { UserModule } from 'src/user/user.module';

@Module({
  controllers: [ParticipantController],
  providers: [ParticipantService, PrismaService],
  exports: [ParticipantService],
  imports: [VoteSessionModule, VotesModule, UserModule],
})
export class ParticipantModule {}
