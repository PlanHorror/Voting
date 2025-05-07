import { forwardRef, Module } from '@nestjs/common';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { VoteSessionModule } from '../vote-session.module';
import { VotesModule } from '../votes/votes.module';

@Module({
  controllers: [CandidatesController],
  providers: [CandidatesService, PrismaService],
  imports: [AuthModule, VoteSessionModule, forwardRef(() => VotesModule)],
  exports: [CandidatesService],
})
export class CandidatesModule {}
