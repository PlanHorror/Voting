import { Module } from '@nestjs/common';
import { ParticipantController } from './participant.controller';
import { ParticipantService } from './participant.service';
import { VoteSessionModule } from '../vote-session.module';
import { VotesModule } from '../votes/votes.module';

@Module({
  controllers: [ParticipantController],
  providers: [ParticipantService],
  exports: [ParticipantService],
  imports: [VoteSessionModule, VotesModule],
})
export class ParticipantModule {}
