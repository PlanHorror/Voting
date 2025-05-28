import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Supervisor } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { SupervisorSignUpDto, SupervisorUpdateDto } from 'src/common/dto';
import { PrismaService } from 'src/prisma.service';
@Injectable()
export class SupervisorService {
  constructor(private readonly prismaService: PrismaService) {}

  /*
   * Raw method
   */

  async findAllSupervisors(): Promise<Supervisor[]> {
    try {
      const supervisors = await this.prismaService.supervisor.findMany({});
      return supervisors;
    } catch (error) {
      throw new NotFoundException('Supervisors not found');
    }
  }
  async findSupervisorById(id: string): Promise<Supervisor> {
    if (!id) {
      throw new BadRequestException('Not enough data provided');
    }
    try {
      const supervisor = await this.prismaService.supervisor.findUnique({
        where: { id },
        include: {
          voteSessions: true,
        },
      });
      if (!supervisor) {
        throw new NotFoundException('Account not found');
      }
      return supervisor;
    } catch (error) {
      throw new NotFoundException('Account not found');
    }
  }
  async findSupervisorByUsername(username: string) {
    if (!username) {
      throw new BadRequestException('Not enough data provided');
    }
    const supervisor = await this.prismaService.supervisor.findUnique({
      where: { username },
      include: {
        voteSessions: true,
      },
    });
    if (!supervisor) {
      throw new NotFoundException('Account not found');
    }
    return supervisor;
  }

  async createSupervisor(data: SupervisorSignUpDto): Promise<Supervisor> {
    try {
      const { username, password } = data;
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      const supervisor = await this.prismaService.supervisor.create({
        data: {
          username,
          password: hashPassword,
        },
      });
      return supervisor;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Username already exists');
      }
      throw new BadRequestException('Error creating supervisor');
    }
  }
  async updateSupervisor(data: SupervisorUpdateDto, user: Supervisor) {
    try {
      const { username, old_password, new_password, confirm_password } = data;
      if (old_password && new_password && confirm_password) {
        const isMatch = await bcrypt.compare(old_password, user.password);
        if (!isMatch) {
          throw new BadRequestException('Old password is incorrect');
        }
        if (new_password !== confirm_password) {
          throw new BadRequestException('New password does not match');
        }
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(new_password, salt);
        return await this.prismaService.supervisor.update({
          where: { id: user.id },
          data: {
            username,
            password: hashPassword,
          },
        });
      } else {
        return await this.prismaService.supervisor.update({
          where: { id: user.id },
          data: {
            username,
          },
        });
      }
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('Username already exists');
      }
      throw new BadRequestException('Error creating supervisor');
    }
  }
  async deleteSupervisor(id: string) {
    try {
      const supervisor = await this.prismaService.supervisor.delete({
        where: { id },
      });
      return supervisor;
    } catch (error) {
      throw new NotFoundException('Account not found');
    }
  }

  /*
   * Service method
   */

  async createSupervisorService(
    data: SupervisorSignUpDto,
  ): Promise<Supervisor> {
    if (!data) {
      throw new BadRequestException('Not enough data provided');
    }
    return await this.createSupervisor(data);
  }
  async updateSupervisorService(
    data: SupervisorUpdateDto,
    user: Supervisor,
  ): Promise<Supervisor> {
    if (!data) {
      throw new BadRequestException('Not enough data provided');
    }
    await this.findSupervisorById(user.id);
    return await this.updateSupervisor(data, user);
  }

  async deleteSupervisorService(id: string): Promise<Supervisor> {
    if (!id) {
      throw new BadRequestException('Not enough data provided');
    }
    await this.findSupervisorById(id);
    return await this.deleteSupervisor(id);
  }

  async dashboardStats(): Promise<any> {
    const totalVoteSessions = await this.prismaService.voteSession.count();
    const activeVoteSessions = await this.prismaService.voteSession.count({
      where: {
        endDate: {
          gte: new Date(),
        },
      },
    });
    const supervisors = await this.prismaService.supervisor.count();
    const totalSigners = await this.prismaService.signer.count();
    const totalParticipants = await this.prismaService.voteParticipant.count();
    const avgParticipantsPerSession = totalParticipants
      ? totalParticipants / totalVoteSessions
      : 0;
    return {
      totalVoteSessions,
      activeVoteSessions,
      supervisors,
      totalSigners,
      totalParticipants,
      avgParticipantsPerSession,
    };
  }

  async countTotalVoteSessionsByMonth(): Promise<any> {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const currentYear = new Date().getFullYear();
    const voteSessions = await this.prismaService.voteSession.findMany({
      where: {
        endDate: {
          gte: new Date(`${currentYear}-01-01`),
          lt: new Date(`${currentYear + 1}-01-01`),
        },
      },
      select: {
        endDate: true,
      },
    });
    const monthlyCounts = Array(12).fill(0);
    voteSessions.forEach((session) => {
      const monthIndex = session.endDate.getMonth();
      monthlyCounts[monthIndex]++;
    });
    const result = months.map((month, index) => ({
      month,
      count: monthlyCounts[index],
    }));
    return result;
  }

  async userDistribution(): Promise<any> {
    const supervisors = await this.prismaService.supervisor.count();
    const signers = await this.prismaService.signer.count();
    const normalUsers = await this.prismaService.user.count();
    return {
      supervisors,
      signers,
      normalUsers,
    };
  }

  async participationRate(): Promise<any> {
    // Select all vote sessions including their total participation count by counting the participation records
    const voteSessions = await this.prismaService.voteSession.findMany({
      include: {
        _count: {
          select: { voteParticipants: true },
        },
      },
    });
    return voteSessions;
  }

  async voteSessionDistribution(): Promise<any> {
    const voteSessions = await this.prismaService.voteSession.findMany({
      select: {
        candidates: true,
      },
    });
    const endVoteSessions = await this.prismaService.voteSession.findMany({
      where: {
        endDate: {
          lte: new Date(),
        },
      },
      select: {
        candidates: true,
      },
    });

    const count = {
      winner: 0,
      tie: 0,
      noVotes: 0,
      inProgress: voteSessions.length - endVoteSessions.length,
    };
    endVoteSessions.forEach((session) => {
      if (session.candidates.length === 0) {
        count.noVotes++;
      } else {
        const maxVotes = Math.max(
          ...session.candidates.map((c) => c.totalVotes),
        );
        const winners = session.candidates.filter(
          (c) => c.totalVotes === maxVotes,
        );
        if (winners.length > 1) {
          count.tie++;
        } else {
          count.winner++;
        }
      }
    });
    return count;
  }
}
