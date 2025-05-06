import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Prisma, User, Signer, Supervisor } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Role } from 'src/common/enum';
import { Payload } from 'src/common/interface';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'defaultSecret',
    });
  }
  async validate(
    payload: Payload,
  ): Promise<{ user: User | Supervisor | Signer; role: Role }> {
    const { id, role } = payload;
    const prisma = new PrismaService();
    try {
      if (role === Role.USER) {
        const user = await prisma.user.findUnique({
          where: { id },
        });
        if (!user) {
          throw new NotFoundException('Account not found');
        }
        return { user, role };
      }
      if (role === Role.SUPERVISOR) {
        const supervisor = await prisma.supervisor.findUnique({
          where: { id },
        });
        if (!supervisor) {
          throw new NotFoundException('Account not found');
        }
        return { user: supervisor, role };
      }
      if (role === Role.SIGNER) {
        const signer = await prisma.signer.findUnique({
          where: { id },
        });
        if (!signer) {
          throw new NotFoundException('Account not found');
        }
        return { user: signer, role };
      }
      throw new BadRequestException('Invalid token');
    } catch (error) {
      throw new BadRequestException('Invalid token');
    }
  }
}
