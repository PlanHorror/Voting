import { forwardRef, Module } from '@nestjs/common';
import { SupervisorService } from './supervisor.service';
import { SupervisorController } from './supervisor.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  providers: [SupervisorService],
  controllers: [SupervisorController],
  exports: [SupervisorService],
  imports: [forwardRef(() => AuthModule)],
})
export class SupervisorModule {}
