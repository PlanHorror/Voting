import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserSignUpDto, UserUpdateDto } from 'src/common/dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}

  /*
   * Raw method
   */
  async findAllUsers() {
    try {
      const users = await this.prismaService.user.findMany({});
      return users;
    } catch (error) {
      throw new BadRequestException('Error fetching users');
    }
  }

  async findUserById(id: string) {
    if (!id) {
      throw new BadRequestException('Not enough data provided');
    }
    try {
      const user = await this.prismaService.user.findUnique({
        where: { id },
        include: {
          voteParticipants: true,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async findUserByCitizenId(citizenId: string) {
    if (!citizenId) {
      throw new BadRequestException('Not enough data provided');
    }
    try {
      const user = await this.prismaService.user.findUnique({
        where: { citizenId },
        include: {
          voteParticipants: true,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async findUserByPhoneNumber(phone: string) {
    if (!phone) {
      throw new BadRequestException('Not enough data provided');
    }
    try {
      const user = await this.prismaService.user.findUnique({
        where: { phone },
        include: {
          voteParticipants: true,
        },
      });
      if (!user) {
        throw new NotFoundException('User not found');
      }
      return user;
    } catch (error) {
      throw new NotFoundException('User not found');
    }
  }

  async createUser(data: UserSignUpDto) {
    try {
      const { citizenId, phone, password } = data;
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      const user = await this.prismaService.user.create({
        data: {
          citizenId,
          phone,
          password: hashPassword,
        },
      });
      return user;
    } catch (error) {
      if (error.code === 'P2023') {
        throw error;
      }
      throw new BadRequestException('Error creating user');
    }
  }

  async updateUser(data: UserUpdateDto, user: User) {
    try {
      const { citizenId, phone, old_password, new_password, confirm_password } =
        data;
      if (old_password && new_password && confirm_password) {
        const verifyPassword = await bcrypt.compare(
          old_password,
          user.password,
        );
        if (new_password !== confirm_password || !verifyPassword) {
          throw new BadRequestException('Invalid password');
        }
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(new_password, salt);
        return await this.prismaService.user.update({
          where: { id: user.id },
          data: {
            citizenId,
            phone,
            password: hashPassword,
          },
        });
      } else {
        return await this.prismaService.user.update({
          where: { id: user.id },
          data: {
            citizenId,
            phone,
          },
        });
      }
    } catch (error) {
      throw new BadRequestException('Error updating user');
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.prismaService.user.delete({
        where: { id },
      });
      return user;
    } catch (error) {
      throw new BadRequestException('Error deleting user');
    }
  }

  /*
   * Service method
   */

  async createUserService(data: UserSignUpDto) {
    if (!data) {
      throw new BadRequestException('Not enough data provided');
    }
    return await this.createUser(data);
  }

  async updateUserService(data: UserUpdateDto, user: User) {
    if (!data || !user) {
      throw new BadRequestException('Not enough data provided');
    }
    await this.findUserById(user.id);
    return await this.updateUser(data, user);
  }

  async deleteUserService(id: string) {
    if (!id) {
      throw new BadRequestException('Not enough data provided');
    }
    await this.findUserById(id);
    return await this.deleteUser(id);
  }
}
