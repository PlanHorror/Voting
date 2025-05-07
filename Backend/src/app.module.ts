import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SupervisorModule } from './supervisor/supervisor.module';
import { VoteSessionModule } from './vote-session/vote-session.module';
import { VotesModule } from './vote-session/votes/votes.module';
import { ParticipantModule } from './vote-session/participant/participant.module';
import { CandidatesModule } from './vote-session/candidates/candidates.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    SupervisorModule,
    VoteSessionModule,
    VotesModule,
    ParticipantModule,
    CandidatesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
