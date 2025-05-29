import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Signer, User } from '@prisma/client';
import { SignerSignUpDto, SignerUpdateDto } from 'src/common/dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class SignerService {
  constructor(private readonly prisma: PrismaService) {}
  /*
   * Raw method
   */

  async findAllSigners(): Promise<Signer[]> {
    try {
      const signers = await this.prisma.signer.findMany({
        include: {
          _count: {
            select: { voteSessions: true },
          },
          voteSessions: true,
        },
      });
      return signers;
    } catch (error) {
      throw new NotFoundException('Signers not found');
    }
  }
  async findSignerById(id: string): Promise<Signer> {
    try {
      const signer = await this.prisma.signer.findUnique({
        where: { id },
        include: {
          voteSessions: true,
          _count: {
            select: { voteSessions: true },
          },
        },
      });
      if (!signer) {
        throw new NotFoundException('Signer not found');
      }
      return signer;
    } catch (error) {
      throw new NotFoundException('Signer not found');
    }
  }

  async findSignerByUsername(username: string): Promise<Signer> {
    const signer = await this.prisma.signer.findUnique({
      where: { username },
      include: {
        voteSessions: true,
      },
    });
    if (!signer) {
      throw new NotFoundException('Signer not found');
    }
    return signer;
  }
  async creatSigner(data: SignerSignUpDto): Promise<Signer> {
    try {
      const { password, ...signerData } = data;
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      const signer = await this.prisma.signer.create({
        data: {
          ...signerData,
          password: hashPassword,
        },
      });
      return signer;
    } catch (error) {
      console.log(error);
      if (error.code === 'P2002') {
        throw new ConflictException('Username already exists');
      }
      throw new BadRequestException('Error creating signer');
    }
  }

  async updateSigner(data: SignerUpdateDto, user: Signer): Promise<Signer> {
    try {
      const { old_password, new_password, confirm_password, ...signerData } =
        data;
      if (old_password && new_password && confirm_password) {
        const verifyPassword = await bcrypt.compare(
          old_password,
          user.password,
        );
        if (new_password !== confirm_password || !verifyPassword) {
          throw new UnauthorizedException('Password does not match');
        }
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(new_password, salt);
        const signer = await this.prisma.signer.update({
          where: { id: user.id },
          data: {
            ...signerData,
            password: hashPassword,
          },
        });
        return signer;
      } else {
        const signer = await this.prisma.signer.update({
          where: { id: user.id },
          data: {
            ...signerData,
          },
        });
        return signer;
      }
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Username already exists');
      }
      throw error;
    }
  }
  async deleteSigner(id: string): Promise<void> {
    try {
      await this.prisma.signer.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException('Error deleting signer');
    }
  }

  /*
   * Service method
   */

  async createSignerService(data: SignerSignUpDto): Promise<Signer> {
    if (!data) {
      throw new BadRequestException('Not enough data provided');
    }
    return await this.creatSigner(data);
  }

  async updateSignerService(
    data: SignerUpdateDto,
    user: Signer,
  ): Promise<Signer> {
    if (!data) {
      throw new BadRequestException('Not enough data provided');
    }
    await this.findSignerById(user.id);
    return await this.updateSigner(data, user);
  }

  async deleteSignerService(id: string): Promise<void> {
    if (!id) {
      throw new BadRequestException('Not enough data provided');
    }
    await this.findSignerById(id);
    return await this.deleteSigner(id);
  }
}
