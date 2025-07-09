import { Injectable } from '@nestjs/common';
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
    const deletedProfile = await this.prisma.user.delete({
      where: { id: userId },
    });

    if (!deletedProfile) {
      throw new Error('Erro ao deletar o perfil');
    }

    return deletedProfile;
  }
}
