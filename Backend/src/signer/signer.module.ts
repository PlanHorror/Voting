import { forwardRef, Module } from '@nestjs/common';
import { SignerService } from './signer.service';
import { SignerController } from './signer.controller';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [SignerController],
  providers: [SignerService, PrismaService],
  exports: [SignerService],
  imports: [forwardRef(() => AuthModule)],
})
export class SignerModule {}
