import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import {
  SignInConvidadoDto,
  SignInUsuarioDto,
  SignUpConvidadoDto,
  SignUpUsuarioDto,
  SignInAdministradorDto,
  SignUpAdministradorDto,
} from 'src/DTO/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Operações de manutenção de Usuários')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Cadastro de Usuário
  @ApiOperation({ summary: 'Cadastra um novo Usuário', description: 'Cria um novo usuário e o grava no banco de dados' })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @Post('signup/usuario')
  signUpUsuario(@Body() dto: SignUpUsuarioDto) {
    return this.authService.signUpUsuario(dto);
  }

  // Login de Usuário
  @ApiOperation({ summary: 'Login de Usuário', description: 'Autentica um usuário e permite o acesso ao sistema' })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @HttpCode(HttpStatus.OK)
  @Post('signin/usuario')
  signInUsuario(@Body() dto: SignInUsuarioDto) {
    return this.authService.signInUsuario(dto);
  }

  // Cadastro de Administrador
  @ApiOperation({ summary: 'Cadastra um novo Administrador', description: 'Cria um novo administrador e o grava no banco de dados' })
  @ApiResponse({ status: 201, description: 'Administrador cadastrado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @Post('signup/administrador')
  signUpAdministrador(@Body() dto: SignUpAdministradorDto) {
    return this.authService.signUpAdministrador(dto);
  }

  // Login de Administrador
  @ApiOperation({ summary: 'Login de Administrador', description: 'Autentica um administrador e permite o acesso ao sistema' })
  @ApiResponse({ status: 200, description: 'Administrador autenticado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @HttpCode(HttpStatus.OK)
  @Post('signin/administrador')
  signInAdministrador(@Body() dto: SignInAdministradorDto) {
    return this.authService.signInAdministrador(dto);
  }

  // Cadastro de Convidado
  @ApiOperation({ summary: 'Cadastra um novo Convidado', description: 'Cria um novo convidado e o grava no banco de dados' })
  @ApiResponse({ status: 201, description: 'Convidado cadastrado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @Post('signup/convidado')
  signUpConvidado(@Body() dto: SignUpConvidadoDto) {
    return this.authService.signUpConvidado(dto);
  }

  // Login de Convidado
  @ApiOperation({ summary: 'Login de Convidado', description: 'Autentica um convidado e permite o acesso ao sistema' })
  @ApiResponse({ status: 200, description: 'Convidado autenticado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @HttpCode(HttpStatus.OK)
  @Post('signin/convidado')
  signInConvidado(@Body() dto: SignInConvidadoDto) {
    return this.authService.signInConvidado(dto);
  }
}
