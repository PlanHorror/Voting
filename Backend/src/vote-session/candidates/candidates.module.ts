import { Module } from '@nestjs/common';
import { CandidatesController } from './candidates.controller';
import { CandidatesService } from './candidates.service';
import { PrismaService } from 'src/prisma.service';
import { AuthModule } from 'src/auth/auth.module';
import { VoteSessionModule } from '../vote-session.module';

@Module({
  controllers: [CandidatesController],
  providers: [CandidatesService, PrismaService],
  imports: [AuthModule, VoteSessionModule],
})
export class CandidatesModule {}
