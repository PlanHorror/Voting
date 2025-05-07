import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VoteSessionService } from '../vote-session.service';
import { PrismaService } from 'src/prisma.service';
import { VoteParticipant } from '@prisma/client';
import { Role } from 'src/common/enum';

@Injectable()
export class ParticipantService {
  constructor(
    private voteSessionService: VoteSessionService,
    private prismaService: PrismaService,
  ) {}

  /*
   * Raw method
   */
  async getAllParticipantByVoteSession(
    voteSessionId: string,
  ): Promise<VoteParticipant[]> {
    if (!voteSessionId) {
      throw new BadRequestException('Not enough data provided');
    }
    try {
      const voteSession =
        await this.voteSessionService.getVoteSessionById(voteSessionId);
      return await this.prismaService.voteParticipant.findMany({
        where: {
          voteSessionId: voteSession.id,
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('Vote session not found');
    }
  }

  async getAllParticipant(): Promise<VoteParticipant[]> {
    try {
      return await this.prismaService.voteParticipant.findMany({
        include: {
          user: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to fetch participants');
    }
  }

  async getParticipantByUserId(userId: string): Promise<VoteParticipant[]> {
    if (!userId) {
      throw new BadRequestException('Not enough data provided');
    }

    try {
      return await this.prismaService.voteParticipant.findMany({
        where: {
          userId,
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('Participant not found');
    }
  }

  async getParticipantById(id: string) {
    if (!id) {
      throw new BadRequestException('Not enough data provided');
    }

    try {
      return await this.prismaService.voteParticipant.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('Participant not found');
    }
  }

  async createParticipant(
    userId: string,
    voteSessionId: string,
  ): Promise<VoteParticipant> {
    try {
      return await this.prismaService.voteParticipant.create({
        data: {
          userId,
          voteSessionId: voteSessionId,
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Participant already exists');
      }
      throw new BadRequestException('Failed to create participant');
    }
  }

  async deleteParticipant(id: string): Promise<VoteParticipant> {
    if (!id) {
      throw new BadRequestException('Not enough data provided');
    }

    try {
      return await this.prismaService.voteParticipant.delete({
        where: {
          id,
        },
        include: {
          user: true,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete participant');
    }
  }

  async deleteAllParticipantsByVoteSessionId(voteSessionId: string) {
    try {
      return await this.prismaService.voteParticipant.deleteMany({
        where: {
          voteSessionId,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete participants');
    }
  }

  /*
   * Service method
   */

  async getAllParticipantByVoteSessionService(
    voteSessionId: string,
    id: string,
    role: Role,
  ): Promise<VoteParticipant[]> {
    if (!voteSessionId || !id || (!role && role !== Role.SUPERVISOR)) {
      throw new BadRequestException('Not enough data provided');
    }

    if (role === Role.SUPERVISOR) {
      const voteSession =
        await this.voteSessionService.getVoteSessionById(voteSessionId);
      if (voteSession.supervisorId !== id) {
        throw new BadRequestException(
          'You are not allowed to access this data',
        );
      }
    }
    if (role === Role.SIGNER) {
      const voteSession =
        await this.voteSessionService.getVoteSessionById(voteSessionId);
      if (voteSession.signerId !== id) {
        throw new BadRequestException(
          'You are not allowed to access this data',
        );
      }
    }
    return await this.getAllParticipantByVoteSession(voteSessionId);
  }

  async createParticipantService(
    userId: string,
    voteSessionId: string,
  ): Promise<VoteParticipant> {
    if (!userId || !voteSessionId) {
      throw new BadRequestException('Not enough data provided');
    }
    return await this.createParticipant(userId, voteSessionId);
  }

  async deleteParticipantService(
    id: string,
    signerId: string,
  ): Promise<VoteParticipant> {
    if (!id || !signerId) {
      throw new BadRequestException('Not enough data provided');
    }
    const voteSession = await this.voteSessionService.getVoteSessionById(id);
    if (voteSession.signerId !== signerId) {
      throw new BadRequestException('You are not allowed to access this data');
    }
    return await this.deleteParticipant(id);
  }
}
