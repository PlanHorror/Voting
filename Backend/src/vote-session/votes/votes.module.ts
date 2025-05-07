import { forwardRef, Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { VoteSessionModule } from '../vote-session.module';
import { PrismaService } from 'src/prisma.service';
import { CandidatesModule } from '../candidates/candidates.module';

@Module({
  providers: [VotesService, PrismaService],
  controllers: [VotesController],
  exports: [VotesService],
  imports: [VoteSessionModule, forwardRef(() => CandidatesModule)],
})
export class VotesModule {}
