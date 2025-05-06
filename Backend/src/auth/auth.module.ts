import { forwardRef, Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/prisma.service';
import { JwtAccessTokenStrategy } from './access-token.strategy';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SupervisorModule } from 'src/supervisor/supervisor.module';
import { UserModule } from 'src/user/user.module';
import { SignerModule } from 'src/signer/signer.module';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtAccessTokenStrategy],
  exports: [AuthService],
  imports: [
    JwtModule,
    PassportModule,
    forwardRef(() => SupervisorModule),
    forwardRef(() => UserModule),
    forwardRef(() => SignerModule),
  ],
})
export class AuthModule {}
