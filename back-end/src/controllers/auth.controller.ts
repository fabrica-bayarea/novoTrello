import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from 'src/services/auth.service';
import { SignInDto, SignUpDto } from 'src/dto/auth.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Operações de Autenticação')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

    // verificando o cadastro do usuário
  @ApiOperation({ summary: 'Cadastra um novo Usuário', description: 'Cria um novo usuário e o grava no banco de dados.' })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  SignUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

    //verificar a entrada do usuário
  @ApiOperation({ summary: 'Autenticação de usuário', description: 'Realiza a autenticação do usuário e retorna um token de acesso para utilização no sistema.' })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  SignIn(@Body() dto: SignInDto) {
    return this.authService.signIn(dto);
  }
}