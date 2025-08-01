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
  Request,
  BadRequestException,
  UnauthorizedException,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiCookieAuth,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
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
import { ResetPasswordDto } from 'src/dto/reset-password.dto';

@ApiTags('Autenticação e Autorização')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {}

  private get BASE_URL_UI(): string {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';
    const baseUrl =
      this.configService.get<string>('BASE_URL') || 'http://localhost';
    const baseUrlUI =
      this.configService.get<string>('BASE_URL_UI') || 'http://localhost:3001';
    return isProduction ? baseUrl : baseUrlUI;
  }

  private setCookieOptions(rememberMe = false) {
    const expirationTime = rememberMe
      ? 30 * 24 * 60 * 60 * 1000 // 30 dias
      : 24 * 60 * 60 * 1000; // 1 dia

    return {
      httpOnly: true,
      path: '/',
      //secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax' as const,
      expires: new Date(Date.now() + expirationTime),
    };
  }

  @ApiOperation({
    summary: 'Cadastra um novo Usuário',
    description: 'Cria um novo usuário e o grava no banco de dados.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário cadastrado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuário cadastrado com sucesso' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Dados inválidos fornecidos' })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email já está em uso',
  })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(@Body() dto: SignUpDto, @Res() res: Response) {
    try {
      if (!dto.email || !dto.password) {
        throw new BadRequestException('Email e senha são obrigatórios');
      }

      const result = await this.authService.signUp(dto);

      return res
        .cookie(
          'trello-session',
          result.accessToken,
          this.setCookieOptions(false),
        )
        .status(HttpStatus.CREATED)
        .json({ message: 'Usuário cadastrado com sucesso' });
    } catch (error) {
      this.logger.error(
        `Erro ao registrar usuário: ${(error as Error).message}`,
        error.stack,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException('Erro interno durante o registro');
    }
  }

  @ApiOperation({
    summary: 'Autenticação de usuário',
    description:
      'Realiza a autenticação do usuário e retorna um token de acesso para utilização no sistema.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário autenticado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Usuário autenticado com sucesso' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Credenciais inválidas' })
  @ApiBadRequestResponse({ description: 'Dados de login inválidos' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signIn(@Body() dto: SignInDto, @Res() res: Response) {
    try {
      if (!dto.email || !dto.password) {
        throw new BadRequestException('Email e senha são obrigatórios');
      }

      const result = await this.authService.signIn(dto);

      return res
        .cookie(
          'trello-session',
          result.accessToken,
          this.setCookieOptions(dto.rememberMe),
        )
        .status(HttpStatus.OK)
        .json({ message: 'Usuário autenticado com sucesso' });
    } catch (error) {
      this.logger.error(
        `Erro ao autenticar usuário: ${(error as Error).message}`,
        error.stack,
      );

      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Erro interno durante a autenticação',
      );
    }
  }

  @ApiOperation({ summary: 'Iniciar autenticação com Google' })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Redireciona para a página de login do Google',
  })
  @UseGuards(IsEnabledAuthGuard('google', 'ENABLE_GOOGLE_OAUTH'))
  @Get('google')
  async googleAuth() {
    // Inicia o fluxo de autenticação do Google (redirecionamento handled by AuthGuard)
  }

  @ApiOperation({ summary: 'Callback do Google após autenticação' })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Login do Google bem-sucedido',
  })
  @ApiUnauthorizedResponse({ description: 'Não autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  @Get('google/callback')
  @UseGuards(IsEnabledAuthGuard('google', 'ENABLE_GOOGLE_OAUTH'))
  async googleAuthRedirect(
    @Req()
    req: {
      user: {
        google_id: string;
        email: string;
        name: string;
        access_token: string;
      };
    },
    @Res() res: Response,
  ) {
    try {
      const { user } = req;

      if (!user || !user.google_id || !user.email) {
        this.logger.warn('Dados do usuário do Google incompletos');
        return res.redirect(
          `${this.BASE_URL_UI}/auth/error?message=incomplete_google_data`,
        );
      }

      const authResult = await this.authService.signInWithProvider('google', {
        providerId: user.google_id,
        email: user.email,
        name: user.name,
      });

      if (!authResult?.accessToken) {
        throw new Error('Token de acesso não gerado');
      }

      return res
        .cookie(
          'trello-session',
          authResult.accessToken,
          this.setCookieOptions(false),
        )
        .redirect(`${this.BASE_URL_UI}/dashboard`);
    } catch (error) {
      this.logger.error(
        `Erro no callback do Google: ${(error as Error).message}`,
        error.stack,
      );
      return res.redirect(
        `${this.BASE_URL_UI}/auth/error?message=google_login_failed`,
      );
    }
  }

  @ApiOperation({ summary: 'Iniciar autenticação com Microsoft' })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Redireciona para a página de login da Microsoft',
  })
  @Get('microsoft')
  @UseGuards(IsEnabledAuthGuard('microsoft', 'ENABLE_MICROSOFT_OAUTH'))
  async microsoftAuth() {
    // Inicia o fluxo de autenticação da Microsoft (redirecionamento handled by AuthGuard)
  }

  @ApiOperation({ summary: 'Callback da Microsoft após autenticação' })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Login da Microsoft bem-sucedido',
  })
  @ApiUnauthorizedResponse({ description: 'Não autorizado' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  @Get('microsoft/callback')
  @UseGuards(IsEnabledAuthGuard('microsoft', 'ENABLE_MICROSOFT_OAUTH'))
  async microsoftAuthRedirect(
    @Req()
    req: {
      user: {
        microsoftId: string;
        email: string;
        name: string;
        access_token: string;
      };
    },
    @Res() res: Response,
  ) {
    try {
      const { user } = req;

      if (!user || !user.microsoftId || !user.email) {
        this.logger.warn('Dados do usuário da Microsoft incompletos');
        return res.redirect(
          `${this.BASE_URL_UI}/auth/error?message=incomplete_microsoft_data`,
        );
      }

      const authResult = await this.authService.signInWithProvider(
        'microsoft',
        {
          providerId: user.microsoftId,
          email: user.email,
          name: user.name,
        },
      );

      if (!authResult?.accessToken) {
        throw new Error('Token de acesso não gerado');
      }

      return res
        .cookie(
          'trello-session',
          authResult.accessToken,
          this.setCookieOptions(false),
        )
        .redirect(`${this.BASE_URL_UI}/dashboard`);
    } catch (error) {
      this.logger.error(
        `Erro no callback da Microsoft: ${(error as Error).message}`,
        error.stack,
      );
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Email enviado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'Email de recuperação enviado com sucesso',
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Email inválido ou não fornecido' })
  @ApiInternalServerErrorResponse({ description: 'Falha ao enviar o email' })
  @HttpCode(HttpStatus.OK)
  @Patch('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    try {
      if (!forgotPasswordDto.email) {
        throw new BadRequestException('Email é obrigatório');
      }

      await this.authService.forgotPassword(forgotPasswordDto);
      return { message: 'Email de recuperação enviado com sucesso' };
    } catch (error) {
      this.logger.error(
        `Erro ao processar esqueci senha: ${(error as Error).message}`,
        error.stack,
      );

      if (error instanceof BadRequestException) {
        throw error;
      }

      throw new InternalServerErrorException(
        'Erro interno ao processar solicitação',
      );
    }
  }

  @ApiOperation({
    summary: 'Altera a senha do usuário com token de recuperação',
    description:
      'Permite que o usuário altere sua senha usando um token de recuperação enviado por email.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Senha alterada com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Senha alterada com sucesso' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Token inválido ou dados incompletos' })
  @ApiUnauthorizedResponse({ description: 'Token expirado ou inválido' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  @HttpCode(HttpStatus.OK)
  @Put('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto) {
    try {
      if (!dto.token || !dto.newPassword) {
        throw new BadRequestException('Token e nova senha são obrigatórios');
      }

      await this.authService.resetPassword(dto);
      return { message: 'Senha alterada com sucesso' };
    } catch (error) {
      this.logger.error(
        `Erro ao resetar senha: ${(error as Error).message}`,
        error.stack,
      );

      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Erro interno ao alterar senha');
    }
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Altera a senha do usuário autenticado',
    description: 'Permite que o usuário autenticado altere sua senha atual.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Senha alterada com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Senha alterada com sucesso' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Usuário não autenticado' })
  @ApiBadRequestResponse({ description: 'Dados inválidos fornecidos' })
  @ApiInternalServerErrorResponse({ description: 'Erro interno do servidor' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Put('change-password')
  async changePassword(
    @Request() req: { user: { id: string } },
    @Body() dto: ChangePasswordDto,
  ) {
    try {
      if (!dto.oldPassword || !dto.newPassword) {
        throw new BadRequestException(
          'Senha atual e nova senha são obrigatórias',
        );
      }

      const userId = req.user.id;
      await this.authService.changePassword(userId, dto);

      return { message: 'Senha alterada com sucesso' };
    } catch (error) {
      this.logger.error(
        `Erro ao alterar senha para usuário ${req.user.id}: ${(error as Error).message}`,
        error.stack,
      );

      if (
        error instanceof BadRequestException ||
        error instanceof UnauthorizedException
      ) {
        throw error;
      }

      throw new InternalServerErrorException('Erro interno ao alterar senha');
    }
  }

  @ApiCookieAuth()
  @ApiOperation({
    summary: 'Logout do usuário',
    description:
      'Realiza o logout do usuário removendo o token de autenticação.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Logout realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Logout realizado com sucesso' },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Usuário não autenticado' })
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  logout(@Res() res: Response) {
    try {
      return res
        .clearCookie('trello-session', {
          httpOnly: true,
          path: '/',
          secure: this.configService.get<string>('NODE_ENV') === 'production',
          sameSite: 'lax',
        })
        .status(HttpStatus.OK)
        .json({ message: 'Logout realizado com sucesso' });
    } catch (error) {
      this.logger.error(
        `Erro ao realizar logout: ${(error as Error).message}`,
        error.stack,
      );
      throw new InternalServerErrorException('Erro interno ao realizar logout');
    }
  }
}
