import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { SignerService } from './signer.service';
import { GetUser } from 'src/common/decorator/getuser.decorator';
import { Signer } from '@prisma/client';
import { Role } from 'src/common/enum';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/common/guard/role.guard';
import { SignerUpdateDto } from 'src/common/dto';

@Controller('signer')
export class SignerController {
  constructor(private signerService: SignerService) {}

  @Get()
  async getAllSigner(): Promise<Signer[]> {
    return this.signerService.findAllSigners();
  }

  @Get('find/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async getSignerById(@Param('id') id: string): Promise<Signer> {
    return this.signerService.findSignerById(id);
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SIGNER]))
  async getProfile(
    @GetUser() userData: { user: Signer; role: Role },
  ): Promise<Signer> {
    return this.signerService.findSignerById(userData.user.id);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SIGNER]))
  async updateSigner(
    @GetUser() userData: { user: Signer; role: Role },
    @Body() updateData: SignerUpdateDto,
  ): Promise<Signer> {
    return this.signerService.updateSignerService(updateData, userData.user);
  }

  @Delete('/:id')
  @UseGuards(AuthGuard('jwt'), new RoleGuard([Role.SUPERVISOR]))
  async deleteSigner(@Param('id') id: string): Promise<void> {
    return this.signerService.deleteSigner(id);
  }
}
