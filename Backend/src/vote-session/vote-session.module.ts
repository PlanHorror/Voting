import { Module } from '@nestjs/common';
import { VoteSessionController } from './vote-session.controller';
import { VoteSessionService } from './vote-session.service';
import { PrismaService } from 'src/prisma.service';
import { SignerModule } from 'src/signer/signer.module';
import { SupervisorModule } from 'src/supervisor/supervisor.module';

@Module({
  controllers: [VoteSessionController],
  providers: [VoteSessionService, PrismaService],
  imports: [SignerModule, SupervisorModule],
  exports: [VoteSessionService],
})
export class VoteSessionModule {}
