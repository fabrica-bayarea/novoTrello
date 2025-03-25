import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import {
  SignInConvidadoDto,
  SignInUsuarioDto,
  SignUpConvidadoDto,
  SignUpUsuarioDto,
  SignInAdministradorDto,
  SignUpAdministradorDto
} from 'src/DTO/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Operações de manutenção de Usuários')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
//cadastro usuario
  @ApiOperation({
    summary: 'Cadastra um novo Usuário',
    description: 'Cria um novo usuário e o grava em banco de dados',
  })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @ApiOperation({
    summary: 'Cadastra um novo Usuário',
    description: 'Cria um novo usuário e o grava em banco de dados',
  })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @Post('signup/usuario')
  signUpUsuario(@Body() dto: SignUpUsuarioDto) {
    return this.authService.signUpUsuario(dto);
  }
//entrada usuario
  @ApiOperation({
    summary: 'Login de Usuário',
    description:
      'Autentica um usuário, e, caso encontrado em banco de dados, permite o acesso desse usuário',
  })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @ApiOperation({
    summary: 'Login de Usuário',
    description:
      'Autentica um usuário, e, caso encontrado em banco de dados, permite o acesso desse usuário',
  })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @HttpCode(HttpStatus.OK)
  @Post('signin/usuario')
  signInUsuario(@Body() dto: SignInUsuarioDto) {
    return this.authService.signInUsuario(dto);
  }
//cadastro admin
  @ApiOperation({
    summary: 'Cadastra um novo Usuário',
    description: 'Cria um novo usuário e o grava em banco de dados',
  })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @ApiOperation({
    summary: 'Cadastra um novo Usuário',
    description: 'Cria um novo usuário e o grava em banco de dados',
  })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @Post('signup/usuario')
  signUpAdministrador(@Body() dto: SignUpAdministradorDto) {
    return this.authService.signUpAdministrador(dto);
  }
//entrada admin
  @ApiOperation({
    summary: 'Login de Usuário',
    description:
      'Autentica um usuário, e, caso encontrado em banco de dados, permite o acesso desse usuário',
  })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @ApiOperation({
    summary: 'Login de Admin',
    description:
      'Autentica um administrador, e, caso encontrado em banco de dados, permite o acesso desse usuário',
  })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @HttpCode(HttpStatus.OK)
  @Post('signin/usuario')
  signInAdmin(@Body() dto: SignInAdministradorDto) {
    return this.authService.signInAdmin(dto);
  }

  
  @ApiOperation({
    summary: 'Cadastra um novo Convidado',
    description:
      'Cria um novo usuário "Convidado" e o grava em banco de dados',
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @ApiOperation({
    summary: 'Cadastra um novo Convidado',
    description:
      'Cria um novo usuário "Convidado" e o grava em banco de dados',
  })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @Post('signup/beneficiario')
  signUpConvidado(@Body() dto: SignUpConvidadoDto) {
    return this.authService.signUpBeneficiario(dto);
  }

  @ApiOperation({
    summary: 'Loga um Convidado',
    description:
      'Autentica um usuário "Convidado", e, caso encontrado em banco de dados, permite o acesso desse usuário',
  })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @ApiOperation({
    summary: 'Loga um Convidado',
    description:
      'Autentica um usuário "Convidado", e, caso encontrado em banco de dados, permite o acesso desse usuário',
  })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @HttpCode(HttpStatus.OK)
  @Post('signin/beneficiario')
  signInConvidado(@Body() dto: SignInConvidadoDto) {
    return this.authService.signInBeneficiario(dto);
  }
}
