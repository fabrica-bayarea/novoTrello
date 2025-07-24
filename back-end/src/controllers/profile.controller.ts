import { Body, Controller, Get, UseGuards, Put, Delete } from '@nestjs/common';
import { ProfileService } from '../services/profile.service';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { ProfileDto } from '../dto/profile.dto';
import { AuthenticatedUser } from 'src/types/user.interface';
import { CurrentUser } from 'src/strategy/decorators/current-user.decorator';

@ApiCookieAuth()
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
  async getUserProfile(@CurrentUser() user: AuthenticatedUser) {
    const profile = await this.profileService.getProfile(user.id);
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
  async updateProfile(
    @CurrentUser() user: AuthenticatedUser,
    @Body() data: ProfileDto,
  ) {
    await this.profileService.updateProfile(user.id, data);
    return { message: 'Perfil atualizado com sucesso.', data: data };
  }

  @ApiOperation({
    summary: 'Deleta a conta do usuário',
    description: 'Deleta a conta do usuário logado',
  })
  @ApiResponse({ status: 200, description: 'Perfil deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Perfil não encontrado' })
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteProfile(@CurrentUser() user: AuthenticatedUser) {
    await this.profileService.deleteProfile(user.id);
    return { message: 'Conta deletada com sucesso.' };
  }
}
