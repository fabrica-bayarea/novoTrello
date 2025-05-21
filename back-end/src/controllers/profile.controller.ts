import { Body, Controller, Get, UseGuards, Put, Delete } from '@nestjs/common';
import { Request } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ProfileDto } from '../dto/profile.dto';

@ApiTags('Perfil de usuário')
@Controller({ path: 'profile', version: '1' })
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @ApiOperation({
    summary: 'Perfil do usuário',
    description: 'Retorna as informações do usuário logado',
  })
  @ApiResponse({ status: 200, description: 'Perfil carregado com sucesso' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUserProfile(@Request() req) {
    const profile = await this.profileService.getProfile(req.user.id);
    return profile;
  }

  @ApiOperation({
    summary: 'Atualiza o perfil do usuário',
    description: 'Atualiza as informações do usuário logado',
  })
  @ApiResponse({ status: 200, description: 'Perfil atualizado com sucesso' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  @UseGuards(JwtAuthGuard)
  @Put()
  async updateProfile(@Request() req, @Body() data: ProfileDto) {
    await this.profileService.updateProfile(req.user.id, data);
    return { message: 'Perfil atualizado com sucesso.', data: data };
  }

  @ApiOperation({
    summary: 'Deleta a conta do usuário',
    description: 'Deleta a conta do usuário logado',
  })
  @ApiResponse({ status: 200, description: 'Conta deletada com sucesso' })
  @ApiResponse({ status: 404, description: 'Conta não encontrada' })
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteProfile(@Request() req) {
    await this.profileService.deleteProfile(req.user.id);
    return { message: 'Conta deletada com sucesso.' };
  }
}
