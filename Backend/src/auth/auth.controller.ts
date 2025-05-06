import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignerSignInDto,
  SignerSignUpDto,
  SupervisorSignInDto,
  SupervisorSignUpDto,
  UserSignInDto,
  UserSignUpDto,
} from 'src/common/dto';
import { Signer, Supervisor, User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('user/login')
  async userLogin(
    @Body() data: UserSignInDto,
  ): Promise<{ accessToken: string }> {
    return this.authService.userLogin(data);
  }

  @Post('user/register')
  async userRegister(@Body() data: UserSignUpDto): Promise<User> {
    return this.authService.userRegister(data);
  }

  @Post('supervisor/login')
  async supervisorLogin(@Body() data: SupervisorSignInDto): Promise<{
    accessToken: string;
  }> {
    return this.authService.supervisorLogin(data);
  }

  @Post('supervisor/register')
  async supervisorRegister(
    @Body() data: SupervisorSignUpDto,
  ): Promise<Supervisor> {
    return this.authService.supervisorRegister(data);
  }

  @Post('signer/login')
  async signerLogin(@Body() data: SignerSignInDto): Promise<{
    accessToken: string;
  }> {
    return this.authService.signerLogin(data);
  }

  @Post('signer/register')
  async signerRegister(@Body() data: SignerSignUpDto): Promise<Signer> {
    return this.authService.signerRegister(data);
  }
}
