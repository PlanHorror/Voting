import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Supervisor, VoteSession } from '@prisma/client';
import {
  VoteSessionCreateDto,
  VoteSessionDto,
} from 'src/common/dto/vote-session.dto';
import { generatePublicandPrivateKey } from 'src/common/utils';
import { PrismaService } from 'src/prisma.service';
import { SignerService } from 'src/signer/signer.service';
import { SupervisorService } from 'src/supervisor/supervisor.service';

@Injectable()
export class VoteSessionService {
  constructor(
    private prismaService: PrismaService,
    private signerService: SignerService,
    private supervisorService: SupervisorService,
  ) {}

  /*
   * Raw method
   */
  async getVoteSession(): Promise<VoteSession[]> {
    return this.prismaService.voteSession.findMany({
      include: {
        candidates: true,
        votes: true,
        voteParticipants: true,
        signer: true,
      },
    });
  }

  async getVoteSessionById(id: string): Promise<VoteSession> {
    if (!id) {
      throw new BadRequestException('Not enough data provided');
    }
    try {
      return await this.prismaService.voteSession.findUniqueOrThrow({
        where: {
          id: id,
        },
        include: {
          candidates: true,
          votes: true,
          voteParticipants: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('Vote session not found');
    }
  }
  getVoteSessionBySupervisorId(supervisor: Supervisor): Promise<VoteSession[]> {
    if (!supervisor) {
      throw new BadRequestException('Not enough data provided');
    }
    try {
      return this.prismaService.voteSession.findMany({
        where: {
          supervisorId: supervisor.id,
        },
        include: {
          candidates: true,
          votes: true,
          voteParticipants: true,
          signer: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('Vote session not found');
    }
  }

  async getVoteSessionBySignerId(signer: Supervisor): Promise<VoteSession[]> {
    if (!signer) {
      throw new BadRequestException('Not enough data provided');
    }
    try {
      return this.prismaService.voteSession.findMany({
        where: {
          signerId: signer.id,
        },
        include: {
          candidates: true,
          votes: true,
          voteParticipants: true,
          signer: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('Vote session not found');
    }
  }

  async createVoteSession(data: VoteSessionDto): Promise<VoteSession> {
    const { publicKey, privateKey } = generatePublicandPrivateKey();
    try {
      return await this.prismaService.voteSession.create({
        data: {
          ...data,
          publicKey: publicKey,
          privateKey: privateKey,
        },
      });
    } catch (error) {
      throw new BadRequestException('Error creating vote session');
    }
  }

  async updateVoteSession(
    id: string,
    data: VoteSessionDto,
  ): Promise<VoteSession> {
    if (!id) {
      throw new BadRequestException('Not enough data provided');
    }
    try {
      return await this.prismaService.voteSession.update({
        where: { id },
        data: data,
      });
    } catch (error) {
      throw new BadRequestException('Error updating vote session');
    }
  }
  async deleteVoteSession(id: string): Promise<VoteSession> {
    if (!id) {
      throw new BadRequestException('Not enough data provided');
    }
    try {
      return await this.prismaService.voteSession.delete({
        where: { id },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Error deleting vote session');
    }
  }

  /*
   * Service method
   */

  async findVoteSessionById(
    id: string,
    supervisor: Supervisor,
  ): Promise<VoteSession> {
    if (!id || !supervisor) {
      throw new BadRequestException('Not enough data provided');
    }
    const voteSession = await this.getVoteSessionById(id);
    if (voteSession.supervisorId !== supervisor.id) {
      throw new BadRequestException(
        'You are not allowed to access this vote session',
      );
    }
    return voteSession;
  }

  async createVoteSessionService(
    data: VoteSessionCreateDto,
    supervisor: Supervisor,
  ): Promise<VoteSession> {
    if (!data) {
      throw new BadRequestException('Not enough data provided');
    }
    await this.signerService.findSignerById(data.signerId);
    return this.createVoteSession({
      ...data,
      supervisorId: supervisor.id,
    });
  }

  async updateVoteSessionService(
    id: string,
    data: VoteSessionCreateDto,
    supervisor: Supervisor,
  ): Promise<VoteSession> {
    if (!data) {
      throw new BadRequestException('Not enough data provided');
    }

    const voteSession = await this.getVoteSessionById(id);
    if (voteSession.supervisorId !== supervisor.id) {
      throw new BadRequestException(
        'You are not allowed to update this vote session',
      );
    }
    await this.signerService.findSignerById(data.signerId);
    return this.updateVoteSession(id, {
      ...data,
      supervisorId: supervisor.id,
    });
  }

  async deleteVoteSessionService(
    id: string,
    supervisor: Supervisor,
  ): Promise<VoteSession> {
    if (!id) {
      throw new BadRequestException('Not enough data provided');
    }
    const voteSession = await this.getVoteSessionById(id);
    if (voteSession.supervisorId !== supervisor.id) {
      throw new BadRequestException(
        'You are not allowed to delete this vote session',
      );
    }
    return this.deleteVoteSession(id);
  }
}
