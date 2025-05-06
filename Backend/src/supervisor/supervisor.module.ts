import { forwardRef, Module } from '@nestjs/common';
import { SupervisorService } from './supervisor.service';
import { SupervisorController } from './supervisor.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [SupervisorService, PrismaService],
  controllers: [SupervisorController],
  exports: [SupervisorService],
  imports: [forwardRef(() => AuthModule)],
})
export class SupervisorModule {}
