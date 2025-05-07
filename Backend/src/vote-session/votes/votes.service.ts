import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { VoteSessionService } from '../vote-session.service';
import { UseVoteDto, VoteDto } from 'src/common/dto/vote.dto';
import { CandidatesService } from '../candidates/candidates.service';
import { Console } from 'console';
import { Vote } from '@prisma/client';
import {
  blindedMessage,
  unblindMessage,
  verifyBlindSignature,
} from 'src/common/utils';
import { signBlindedMessage } from 'src/common/utils/sign.util';

@Injectable()
export class VotesService {
  constructor(
    private prismaService: PrismaService,
    private voteSessionService: VoteSessionService,
    private candidateService: CandidatesService,
  ) {}

  /*
   * Raw method
   */
  async getAllVotes(): Promise<Vote[]> {
    return await this.prismaService.vote.findMany({
      include: {
        voteSession: true,
      },
    });
  }

  async getVotesByVoteSessionId(voteSessionId: string): Promise<Vote[]> {
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

  async getVoteById(id: string): Promise<Vote> {
    if (!id) {
      throw new BadRequestException('Not enough data provided');
    }
    try {
      const vote = await this.prismaService.vote.findUnique({
        where: {
          id: id,
        },
        include: {
          voteSession: true,
        },
      });
      if (!vote) {
        throw new NotFoundException('Vote not found');
      }
      return vote;
    } catch (error) {
      throw new Error('Vote not found');
    }
  }

  async getVoteByKey(key: string): Promise<Vote> {
    if (!key) {
      throw new BadRequestException('Not enough data provided');
    }
    try {
      const vote = await this.prismaService.vote.findFirst({
        where: {
          key: key,
        },
        include: {
          voteSession: true,
        },
      });
      if (!vote) {
        throw new NotFoundException('Vote not found');
      }
      return vote;
    } catch (error) {
      throw new NotFoundException('Vote not found');
    }
  }

  async createVote(data: VoteDto): Promise<Vote> {
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
        console.error(error);
        throw new BadRequestException('Failed to create vote');
      }
    }
  }

  async updateVote(id: string, voteData: VoteDto): Promise<Vote> {
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

  async changeVoteStatus(id: string, status: boolean): Promise<Vote> {
    try {
      return await this.prismaService.vote.update({
        where: {
          id: id,
        },
        data: {
          isVoted: status,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to change vote status');
    }
  }

  async deleteVote(id: string): Promise<void> {
    try {
      await this.prismaService.vote.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete vote');
    }
  }

  async deleteVotesByVoteSessionId(voteSessionId: string): Promise<void> {
    try {
      await this.prismaService.vote.deleteMany({
        where: {
          voteSessionId: voteSessionId,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to delete votes');
    }
  }

  async useVoted(voteId: string, candidateId: string): Promise<Vote> {
    try {
      return await this.prismaService.vote.update({
        where: {
          id: voteId,
        },
        data: {
          isVoted: true,
          candidateId: candidateId,
          voteAt: new Date(),
        },
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Failed to use vote');
    }
  }

  /*
   * Service method
   */

  async voteService(data: UseVoteDto, voteSessionId: string) {
    const voteSession =
      await this.voteSessionService.getVoteSessionById(voteSessionId);
    const candidate = await this.candidateService.findCandidateByHashId(
      data.candidateIdHash,
    );
    const vote = await this.getVoteByKey(data.key);
    const now = new Date();
    if (voteSession.id !== vote.voteSessionId) {
      throw new ConflictException('Vote session not found');
    }
    if (vote.isVoted || candidate.voteSessionId !== voteSession.id) {
      throw new ConflictException('Vote invalid or already used');
    }
    if (voteSession.endDate < now) {
      throw new ConflictException('Vote session is not active');
    }
    const { blindMessage, blindingFactor, hashMessage } = blindedMessage(
      data.candidateIdHash,
      voteSession.publicKey,
    );
    const messageSignature = signBlindedMessage(
      blindMessage,
      voteSession.privateKey,
    );
    const unblindMessages = unblindMessage(
      messageSignature,
      blindingFactor,
      voteSession.publicKey,
    );
    const verifyBlindSignatures = verifyBlindSignature(
      unblindMessages,
      hashMessage,
      voteSession.publicKey,
    );
    if (!verifyBlindSignatures) {
      throw new ConflictException('Vote invalid or already used');
    }
    await this.useVoted(vote.id, candidate.id);
    await this.candidateService.changeVoteCount(candidate.id, 1);
    console.log(verifyBlindSignatures);
    console.log('voteService', data, voteSessionId);
  }
}
