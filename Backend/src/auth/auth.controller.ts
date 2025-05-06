import { Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  SignerSignInDto,
  SignerSignUpDto,
  SupervisorSignInDto,
  SupervisorSignUpDto,
  UserSignInDto,
  UserSignUpDto,
} from 'src/common/dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('user/login')
  async userLogin(data: UserSignInDto) {}

  @Post('user/register')
  async userRegister(data: UserSignUpDto) {}

  @Post('supervisor/login')
  async supervisorLogin(data: SupervisorSignInDto) {}

  @Post('supervisor/register')
  async supervisorRegister(data: SupervisorSignUpDto) {}

  @Post('signer/login')
  async signerLogin(data: SignerSignInDto) {}

  @Post('signer/register')
  async signerRegister(data: SignerSignUpDto) {}
}
