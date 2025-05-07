import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { VoteSessionService } from '../vote-session.service';
import { VoteDto } from 'src/common/dto/vote.dto';

@Injectable()
export class VotesService {
  constructor(
    private prismaService: PrismaService,
    private voteSessionService: VoteSessionService,
  ) {}

  /*
   * Raw method
   */
  async getAllVotes() {
    return await this.prismaService.vote.findMany({
      include: {
        voteSession: true,
      },
    });
  }

  async getVotesByVoteSessionId(voteSessionId: string) {
    if (!voteSessionId) {
      throw new BadRequestException('Not enough data provided');
    }
    try {
      const voteSession =
        await this.voteSessionService.getVoteSessionById(voteSessionId);
      return await this.prismaService.vote.findMany({
        where: {
          voteSessionId: voteSession.id,
        },
        include: {
          voteSession: true,
        },
      });
    } catch (error) {
      throw new NotFoundException('Vote session not found');
    }
  }

  async getVoteById(id: string) {
    if (!id) {
      throw new BadRequestException('Not enough data provided');
    }
    try {
      return await this.prismaService.vote.findUnique({
        where: {
          id: id,
        },
        include: {
          voteSession: true,
        },
      });
    } catch (error) {
      throw new Error('Vote not found');
    }
  }

  async createVote(data: VoteDto) {
    try {
      const voteSession = await this.voteSessionService.getVoteSessionById(
        data.voteSessionId,
      );
      return await this.prismaService.vote.create({
        data: {
          ...data,
          voteSessionId: voteSession.id,
        },
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Vote already exists');
      } else {
        throw new BadRequestException('Failed to create vote');
      }
    }
  }

  async updateVote(id: string, voteData: VoteDto) {
    try {
      return await this.prismaService.vote.update({
        where: {
          id: id,
        },
        data: voteData,
      });
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('Vote already exists');
      }
      throw new BadRequestException('Failed to update vote');
    }
  }

  async deleteVote(id: string) {
    try {
      return await this.prismaService.vote.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete vote');
    }
  }

  async deleteVotesByVoteSessionId(voteSessionId: string) {
    try {
      return await this.prismaService.vote.deleteMany({
        where: {
          voteSessionId: voteSessionId,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete votes');
    }
  }

  /*
   * Service method
   */
}
