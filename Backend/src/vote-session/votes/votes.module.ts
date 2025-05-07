import { Module } from '@nestjs/common';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { VoteSessionModule } from '../vote-session.module';

@Module({
  providers: [VotesService],
  controllers: [VotesController],
  exports: [VotesService],
  imports: [VoteSessionModule],
})
export class VotesModule {}
