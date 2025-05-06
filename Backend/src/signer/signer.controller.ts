import { Controller, Get, UseGuards } from '@nestjs/common';
import { SignerService } from './signer.service';
import { GetUser } from 'src/common/decorator/getuser.decorator';
import { Signer } from '@prisma/client';
import { Role } from 'src/common/enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/common/guard/role.guard';

@Controller('signer')
export class SignerController {
  constructor(private signerService: SignerService) {}

  @Get()
  async getAllSigner(): Promise<Signer[]> {
    return this.signerService.findAllSigners();
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SIGNER]))
  async getProfile(
    @GetUser() userData: { user: Signer; role: Role },
  ): Promise<Signer> {
    return this.signerService.findSignerById(userData.user.id);
  }
}
