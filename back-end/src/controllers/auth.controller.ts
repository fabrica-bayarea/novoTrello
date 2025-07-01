import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Req,
  UseGuards,
  Res,
  Logger,
  Patch,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/services/auth.service';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  SignInDto,
  SignUpDto,
} from 'src/dto/auth.dto';
import { Response } from 'express';
import { IsEnabledAuthGuard } from 'src/guards/is-enable-oauth.guard';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { Request } from '@nestjs/common';
import { ResetPasswordDto } from 'src/dto/reset-password.dto';

@ApiTags('Operações de Autenticação')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private logger: Logger,
  ) {}

  private get BASE_URL_UI(): string {
    const isProduction = this.configService.get<string>('NODE_ENV') === 'production';
    const baseUrl = this.configService.get<string>('BASE_URL') || 'http://localhost';
    const baseUrlUI = this.configService.get<string>('BASE_URL_UI') || 'http://localhost:3001';
    return isProduction ? baseUrl : baseUrlUI;
  }

  @ApiOperation({
    summary: 'Cadastra um novo Usuário',
    description: 'Cria um novo usuário e o grava no banco de dados.',
  })
  @ApiResponse({ status: 201, description: 'Usuário cadastrado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais tomadas' })
  @Post('signup')
  SignUp(@Body() dto: SignUpDto) {
    try {
      return this.authService.signUp(dto);
    } catch (error) {
      this.logger.error('Erro ao tentar realizar registro:', error.message);
    }
  }

  @ApiOperation({
    summary: 'Autenticação de usuário',
    description:
      'Realiza a autenticação do usuário e retorna um token de acesso para utilização no sistema.',
  })
  @ApiResponse({ status: 200, description: 'Usuário autenticado com sucesso' })
  @ApiResponse({ status: 403, description: 'Credenciais inválidas' })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  SignIn(@Body() dto: SignInDto) {
    try {
      return this.authService.signIn(dto);
    } catch (error) {
      this.logger.error('Erro ao tentar realizar Login:', error.message);
    }
  }

  @ApiOperation({ summary: 'Iniciar autenticação com Google' })
  @ApiResponse({
    status: 302,
    description: 'Redireciona para a página de login do Google',
  })
  @UseGuards(IsEnabledAuthGuard('google', 'ENABLE_GOOGLE_OAUTH'))
  @Get('google')
  async googleAuth() {
    /* 
      --------------------------------------------------------------------------------
      Inicia o fluxo de autenticação do Google (redirecionamento handled by AuthGuard)
      --------------------------------------------------------------------------------
    */
  }

  @ApiOperation({ summary: 'Callback do Google após autenticação' })
  @ApiResponse({ status: 200, description: 'Login do Google bem-sucedido' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @Get('google/callback')
  @UseGuards(IsEnabledAuthGuard('google', 'ENABLE_GOOGLE_OAUTH'))
  async googleAuthRedirect(@Req() { user }: any, @Res() res: Response) {
    try {
      const json = await this.authService.signInWithProvider('google', {
        ...user,
        providerId: user.google_id,
      });
      if (json) {
        return res
          .cookie('auth-token', json.accessToken, {
            httpOnly: true,
            path: "/",
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'lax',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          })
          .redirect(
            `${this.BASE_URL_UI}/dashboard`,
          );
      }
      throw new Error('Invalid authentication result');
    } catch (error) {
      this.logger.error('Erro no callback do Google:', error.message);
      return res.redirect(
        `${this.BASE_URL_UI}/auth/error?message=google_login_failed`,
      );
    }
  }

  @ApiOperation({ summary: 'Iniciar autenticação com Microsoft' })
  @ApiResponse({
    status: 302,
    description: 'Redireciona para a página de login da Microsoft',
  })
  @Get('microsoft')
  @UseGuards(IsEnabledAuthGuard('microsoft', 'ENABLE_MICROSOFT_OAUTH'))
  async microsoftAuth() {
    /* 
      -----------------------------------------------------------------------------------
      Inicia o fluxo de autenticação da Microsoft (redirecionamento handled by AuthGuard)
      -----------------------------------------------------------------------------------
    */
  }

  @ApiOperation({ summary: 'Callback da Microsoft após autenticação' })
  @ApiResponse({ status: 200, description: 'Login da Microsoft bem-sucedido' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @Get('microsoft/callback')
  @UseGuards(IsEnabledAuthGuard('microsoft', 'ENABLE_MICROSOFT_OAUTH'))
  async microsoftAuthRedirect(@Req() { user }: any, @Res() res: Response) {
    try {
      const json = await this.authService.signInWithProvider(
        'microsoft',
        { ...user, providerId: user.microsoftId },
      );
      if (json) {
        return res
          .cookie('auth-token', json.accessToken, {
            httpOnly: true,
            path: "/",
            secure: this.configService.get<string>('NODE_ENV') === 'production',
            sameSite: 'lax',
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
          })
          .redirect(
            `${this.BASE_URL_UI}/dashboard`,
          );
      }
      throw new Error('Invalid authentication result');
    } catch (error) {
      this.logger.error('Erro no callback do Microsoft:', error.message);
      return res.redirect(
        `${this.BASE_URL_UI}/auth/error?message=microsoft_login_failed`,
      );
    }
  }

  @ApiOperation({
    summary: 'Envia email para recuperação de senha',
    description:
      'Envia um email com instruções para recuperação de senha ao usuário.',
  })
  @ApiResponse({ status: 200, description: 'Email enviado com sucesso' })
  @ApiResponse({ status: 401, description: 'Falha ao enviar o email' })
  @Patch('/forgot-password')
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Put('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @ApiOperation({
    summary: 'Altera a senha do usuário',
    description: 'Permite que o usuário altere sua senha.',
  })
  @ApiResponse({ status: 200, description: 'Senha alterada com sucesso' })
  @ApiResponse({ status: 401, description: 'Usuário não autenticado' })
  @UseGuards(JwtAuthGuard)
  @Put('change-password')
  async changePassword(@Request() req, @Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(req.user.id, dto);
    return { message: 'Senha alterada com sucesso.' };
  }
}
