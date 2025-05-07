import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { VoteSessionService } from '../vote-session.service';
import { PrismaService } from 'src/prisma.service';
import { VoteParticipant } from '@prisma/client';
import { Role } from 'src/common/enum';
import { VotesService } from '../votes/votes.service';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
@Injectable()
export class ParticipantService {
  constructor(
    private voteSessionService: VoteSessionService,
    private prismaService: PrismaService,
    private votesService: VotesService,
    private userService: UserService,
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
      const participant = await this.prismaService.voteParticipant.findUnique({
        where: {
          id,
        },
        include: {
          user: true,
          voteSession: true,
        },
      });
      if (!participant) {
        throw new NotFoundException('Participant not found');
      }
      return participant;
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
  ): Promise<{ key: string }> {
    if (!userId || !voteSessionId) {
      throw new BadRequestException('Not enough data provided');
    }
    const voteSession =
      await this.voteSessionService.getVoteSessionById(voteSessionId);
    const user = await this.userService.findUserById(userId);
    const now = new Date();
    if (voteSession.endDate < now) {
      throw new BadRequestException('Vote session has ended');
    }

    await this.createParticipant(userId, voteSessionId);
    const key = await bcrypt.hash(user.citizenId, 10);
    await this.votesService.createVote({
      key,
      voteSessionId: voteSession.id,
    });
    return { key };
  }

  async deleteParticipantService(
    id: string,
    userid: string,
    role: Role,
  ): Promise<void> {
    if (!id || !userid || (!role && role !== Role.SUPERVISOR)) {
      throw new BadRequestException('Not enough data provided');
    }
    const participant = await this.getParticipantById(id);
    if (role === Role.SUPERVISOR) {
      if (participant.voteSession.supervisorId !== userid) {
        throw new BadRequestException(
          'You are not allowed to delete this participant',
        );
      }
    }
    if (role === Role.SIGNER) {
      if (participant.voteSession.signerId !== userid) {
        throw new BadRequestException(
          'You are not allowed to delete this participant',
        );
      }
    }

    await this.deleteParticipant(id);
  }
}
