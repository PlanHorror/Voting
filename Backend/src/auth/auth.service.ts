import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  SignerSignUpDto,
  SupervisorSignInDto,
  SupervisorSignUpDto,
  UserSignInDto,
  UserSignUpDto,
} from 'src/common/dto';
import { SignerService } from 'src/signer/signer.service';
import { SupervisorService } from 'src/supervisor/supervisor.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { Payload } from 'src/common/interface';
import { JwtService } from '@nestjs/jwt';
import { Role } from 'src/common/enum';
import { Signer, Supervisor, User } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private supervisorService: SupervisorService,
    private signerService: SignerService,
    private jwtService: JwtService,
  ) {}

  // Generate access token
  async generateTokens(payload: Payload): Promise<{ accessToken: string }> {
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '1h',
      secret: process.env.JWT_SECRET,
    });
    return { accessToken };
  }

  // Login methods

  async userLogin(data: UserSignInDto): Promise<{ accessToken: string }> {
    const { citizenId, password } = data;
    const user = await this.userService.findUserByCitizenId(citizenId);
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    } else {
      const payload = {
        id: user.id,
        citizenId: user.citizenId,
        role: Role.USER,
      };
      return this.generateTokens(payload);
    }
  }

  async supervisorLogin(data: SupervisorSignInDto): Promise<{
    accessToken: string;
  }> {
    const { username, password } = data;
    const supervisor =
      await this.supervisorService.findSupervisorByUsername(username);
    const isPasswordValid = await bcrypt.compare(password, supervisor.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    } else {
      const payload = {
        id: supervisor.id,
        username: supervisor.username,
        role: Role.SUPERVISOR,
      };
      return this.generateTokens(payload);
    }
  }

  async signerLogin(
    data: SupervisorSignInDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = data;
    const signer = await this.signerService.findSignerByUsername(username);
    const isPasswordValid = await bcrypt.compare(password, signer.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    } else {
      const payload = {
        id: signer.id,
        username: signer.username,
        role: Role.SIGNER,
      };
      return this.generateTokens(payload);
    }
  }

  // Register methods

  async userRegister(data: UserSignUpDto): Promise<User> {
    return await this.userService.createUserService(data);
  }

  async supervisorRegister(data: SupervisorSignUpDto): Promise<Supervisor> {
    return await this.supervisorService.createSupervisor(data);
  }

  async signerRegister(data: SignerSignUpDto): Promise<Signer> {
    return await this.signerService.createSignerService(data);
  }
}
