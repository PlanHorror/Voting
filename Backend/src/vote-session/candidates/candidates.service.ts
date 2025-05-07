import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CandidateDataDto,
  CandidateDto,
  ListCandidateDto,
} from 'src/common/dto/candidate.dto';
import { PrismaService } from 'src/prisma.service';
import { VoteSessionService } from '../vote-session.service';
import { Candidate } from '@prisma/client';
import * as bcrypt from 'bcrypt';
@Injectable()
export class CandidatesService {
  constructor(
    private prismaService: PrismaService,
    private voteSessionService: VoteSessionService,
  ) {}

  /*
   * Raw method
   */

  async findAllCandidates() {
    try {
      const candidates = await this.prismaService.candidate.findMany({});
      return candidates;
    } catch (error) {
      throw new NotFoundException('Candidates not found');
    }
  }

  async findCandidateById(id: string) {
    try {
      const candidate = await this.prismaService.candidate.findUnique({
        where: { id },
        include: {
          voteSession: true,
        },
      });
      if (!candidate) {
        throw new NotFoundException('Candidate not found');
      }
      return candidate;
    } catch (error) {
      throw new NotFoundException('Candidate not found');
    }
  }

  async findCandidateByHashId(hashId: string) {
    try {
      const candidate = await this.prismaService.candidate.findUnique({
        where: { hashId },
        include: {
          voteSession: true,
        },
      });
      if (!candidate) {
        throw new NotFoundException('Candidate not found');
      }
      return candidate;
    } catch (error) {
      throw new NotFoundException('Candidate not found');
    }
  }

  async findCandidateByVoteSessionId(voteSessionId: string) {
    try {
      const candidates = await this.prismaService.candidate.findMany({
        where: { voteSessionId },
      });
      if (!candidates) {
        throw new NotFoundException('Candidates not found');
      }
      return candidates;
    } catch (error) {
      throw new NotFoundException('Candidates not found');
    }
  }

  async findCandidateBySupervisorId(
    supervisorId: string,
  ): Promise<Candidate[]> {
    try {
      const candidates = await this.prismaService.candidate.findMany({
        where: { voteSession: { supervisorId } },
        include: {
          voteSession: true,
        },
      });
      if (!candidates) {
        throw new NotFoundException('Candidates not found');
      }
      return candidates;
    } catch (error) {
      throw new NotFoundException('Candidates not found');
    }
  }

  async createCandidate(voteSessionId: string, data: CandidateDataDto) {
    try {
      const { name, description } = data;
      const candidate = await this.prismaService.candidate.create({
        data: {
          name,
          description,
          voteSessionId,
        },
      });
      const hashId = await bcrypt.hash(candidate.id, 10);
      await this.prismaService.candidate.update({
        where: { id: candidate.id },
        data: { hashId },
      });
      return candidate;
    } catch (error) {
      throw new BadRequestException('Error creating candidate');
    }
  }

  async updateCandidate(id: string, data: CandidateDataDto) {
    try {
      const { name, description } = data;
      const candidate = await this.prismaService.candidate.update({
        where: { id },
        data: {
          name,
          description,
        },
      });
      return candidate;
    } catch (error) {
      throw new BadRequestException('Error updating candidate');
    }
  }

  async deleteCandidate(id: string) {
    try {
      const candidate = await this.prismaService.candidate.delete({
        where: { id },
      });
      return candidate;
    } catch (error) {
      throw new BadRequestException('Error deleting candidate');
    }
  }

  async changeVoteCount(id: string, change: number) {
    try {
      const candidate = await this.prismaService.candidate.update({
        where: { id },
        data: {
          totalVotes: {
            increment: change,
          },
        },
      });
      return candidate;
    } catch (error) {
      throw new BadRequestException('Error increasing vote count');
    }
  }

  /*
   * Service method
   */

  async findCandidatesByIdService(
    id: string,
    supervisorId: string,
  ): Promise<CandidateDataDto> {
    if (!id || !supervisorId) {
      throw new BadRequestException('Not enough data provided');
    }
    const candidate = await this.findCandidateById(id);
    if (supervisorId !== candidate.voteSession.supervisorId) {
      throw new BadRequestException(
        'You are not allowed to get a candidate for this vote session',
      );
    }
    return candidate;
  }

  async findCandidatesByVoteSessionIdService(
    voteSessionId: string,
    supervisorId: string,
  ): Promise<CandidateDataDto[]> {
    if (!voteSessionId || !supervisorId) {
      throw new BadRequestException('Not enough data provided');
    }

    const voteSession =
      await this.voteSessionService.getVoteSessionById(voteSessionId);
    if (supervisorId !== voteSession.supervisorId) {
      throw new BadRequestException(
        'You are not allowed to get a candidate for this vote session',
      );
    }
    return await this.findCandidateByVoteSessionId(voteSessionId);
  }

  async createCandidateService(
    data: CandidateDto,
    supervisorId: string,
  ): Promise<CandidateDataDto> {
    if (!data || !supervisorId) {
      throw new BadRequestException('Not enough data provided');
    }
    const voteSession = await this.voteSessionService.getVoteSessionById(
      data.voteSessionId,
    );
    if (supervisorId !== voteSession.supervisorId) {
      throw new BadRequestException(
        'You are not allowed to create a candidate for this vote session',
      );
    }
    return await this.createCandidate(data.voteSessionId, {
      name: data.name,
      description: data.description,
    });
  }

  async createManyCandidatesService(
    data: ListCandidateDto,
    supervisorId: string,
  ): Promise<CandidateDataDto[]> {
    if (!data || !supervisorId) {
      throw new BadRequestException('Not enough data provided');
    }
    const voteSession = await this.voteSessionService.getVoteSessionById(
      data.voteSessionId,
    );
    if (supervisorId !== voteSession.supervisorId) {
      throw new BadRequestException(
        'You are not allowed to create a candidate for this vote session',
      );
    }

    const { voteSessionId, candidates } = data;
    const createdCandidates = await Promise.all(
      candidates.map((candidate) =>
        this.createCandidate(voteSessionId, candidate),
      ),
    );
    return createdCandidates;
  }

  async updateCandidateService(
    id: string,
    data: CandidateDataDto,
    supervisorId: string,
  ): Promise<CandidateDataDto> {
    if (!data || !id || !supervisorId) {
      throw new BadRequestException('Not enough data provided');
    }
    const candidate = await this.findCandidateById(id);
    const voteSession = await this.voteSessionService.getVoteSessionById(
      candidate.voteSessionId,
    );
    if (supervisorId !== voteSession.supervisorId) {
      throw new BadRequestException(
        'You are not allowed to update a candidate for this vote session',
      );
    }
    return await this.updateCandidate(id, data);
  }

  async deleteCandidateService(
    id: string,
    supervisorId: string,
  ): Promise<void> {
    if (!id || !supervisorId) {
      throw new BadRequestException('Not enough data provided');
    }
    const candidate = await this.findCandidateById(id);
    const voteSession = await this.voteSessionService.getVoteSessionById(
      candidate.voteSessionId,
    );
    if (supervisorId !== voteSession.supervisorId) {
      throw new BadRequestException(
        'You are not allowed to delete a candidate for this vote session',
      );
    }
    await this.deleteCandidate(id);
  }

  async deleteAllCandidatesByVoteSessionId(
    voteSessionId: string,
    supervisorId: string,
  ): Promise<void> {
    if (!voteSessionId || !supervisorId) {
      throw new BadRequestException('Not enough data provided');
    }
    const voteSession =
      await this.voteSessionService.getVoteSessionById(voteSessionId);
    if (supervisorId !== voteSession.supervisorId) {
      throw new BadRequestException(
        'You are not allowed to delete a candidate for this vote session',
      );
    }
    const candidates = await this.findCandidateByVoteSessionId(voteSessionId);
    await Promise.all(
      candidates.map((candidate) => this.deleteCandidate(candidate.id)),
    );
  }
}
