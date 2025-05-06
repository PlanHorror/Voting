import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { SupervisorModule } from './supervisor/supervisor.module';
import { VoteSessionModule } from './vote-session/vote-session.module';

@Module({
  imports: [AuthModule, UserModule, SupervisorModule, VoteSessionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
