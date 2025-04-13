import { 
  Body, 
  Controller, 
  HttpCode, 
  HttpStatus, 
  Post, 
  Get, 
  Req, 
  UseGuards, 
  Res 
} from '@nestjs/common';
import { 
  ApiOperation, 
  ApiResponse, 
  ApiTags 
} from '@nestjs/swagger';
import { AuthService } from 'src/services/auth.service';
import { SignInDto, SignUpDto } from 'src/dto/auth.dto';
import { Response } from 'express';
import { IsEnabledAuthGuard } from 'src/guards/is-enable-oauth.guard';

@ApiTags('Operações de Autenticação')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Cadastra um novo Usuário', description: 'Cria um novo usuário e o grava no banco de dados.' })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @Post('signup')
  SignUp(@Body() dto: SignUpDto) {
    return this.authService.signUp(dto);
  }

  @ApiOperation({ summary: 'Autenticação de usuário', description: 'Realiza a autenticação do usuário e retorna um token de acesso para utilização no sistema.' })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  SignIn(@Body() dto: SignInDto) {
    return this.authService.signInJwt(dto);
  }

  @ApiOperation({ summary: 'Iniciar autenticação com Google' })
  @ApiResponse({ status: 302, description: 'Redireciona para a página de login do Google' })
  @Get('google')
  @UseGuards(IsEnabledAuthGuard('google', 'ENABLE_GOOGLE_OAUTH'))
  async googleAuth() {
    // Inicia o fluxo de autenticação do Google (redirecionamento handled by AuthGuard)
  }

  @ApiOperation({ summary: 'Callback do Google após autenticação' })
  @ApiResponse({ status: 200, description: 'Login do Google bem-sucedido',})
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @Get('google/callback')
  @UseGuards(IsEnabledAuthGuard('google', 'ENABLE_GOOGLE_OAUTH'))
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const result = await this.authService.signInGoogle(req.user);
    return res.send(result);
  }

  @ApiOperation({ summary: 'Iniciar autenticação com Microsoft' })
  @ApiResponse({ status: 302, description: 'Redireciona para a página de login da Microsoft' })
  @Get('microsoft')
  @UseGuards(IsEnabledAuthGuard('microsoft', 'ENABLE_MICROSOFT_OAUTH'))
  async microsoftAuth() {
    // Inicia o fluxo de autenticação da Microsoft (redirecionamento handled by AuthGuard)
  }

  @ApiOperation({ summary: 'Callback da Microsoft após autenticação' })
  @ApiResponse({ status: 200, description: 'Login da Microsoft bem-sucedido',})
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @Get('microsoft/callback')
  @UseGuards(IsEnabledAuthGuard('microsoft', 'ENABLE_MICROSOFT_OAUTH'))
  async microsoftAuthRedirect(@Req() req: any, @Res() res: Response) {
    const result = await this.authService.signInMicrosoft(req.user);
    return res.send(result);
  }
}
