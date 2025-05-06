import { Module } from '@nestjs/common';
import { VoteSessionController } from './vote-session.controller';
import { VoteSessionService } from './vote-session.service';
import { ParticipantModule } from './participant/participant.module';
import { VotesModule } from './votes/votes.module';
import { CandidatesModule } from './candidates/candidates.module';

@Module({
  controllers: [VoteSessionController],
  providers: [VoteSessionService],
  imports: [ParticipantModule, VotesModule, CandidatesModule]
})
export class VoteSessionModule {}
