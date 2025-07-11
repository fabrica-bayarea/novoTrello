import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ProfileDto } from '../dto/profile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!profile) {
      throw new Error('Usuário não encontrado');
    }

    const userData = {
      name: profile.name,
      userName: profile.userName,
      email: profile.email,
    };

    return userData;
  }

  async updateProfile(userId: string, data: ProfileDto) {
    const updatedProfile = await this.prisma.user.update({
      where: { id: userId },
      data,
    });

    if (!updatedProfile) {
      throw new Error('Erro ao atualizar o perfil');
    }

    if (updatedProfile.providerId) {
      throw new Error(
        'Não é possível atualizar o email de um usuário cadastrado por provedor externo',
      );
    }

    return updatedProfile;
  }

  async deleteProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    await this.prisma.$transaction(async (tx) => {
      await tx.task.deleteMany({
        where: {
          list: {
            board: {
              ownerId: userId,
            },
          },
        },
      });

      await tx.list.deleteMany({
        where: {
          board: {
            ownerId: userId,
          },
        },
      });

      await tx.boardMember.deleteMany({
        where: {
          userId: userId,
        },
      });

      await tx.board.deleteMany({
        where: {
          ownerId: userId,
        },
      });

      await tx.user.delete({
        where: { id: userId },
      });
    });

    return { message: 'Conta e dados associados excluídos com sucesso' };
  }
}
