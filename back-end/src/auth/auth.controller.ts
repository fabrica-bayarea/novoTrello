import { Controller, Get, Request, UseGuards, Post, Body } from '@nestjs/common';
import { GoogleOAuthGuard } from './guard/google-oauth.guard';
import { GoogleOAuthCallbackGuard } from './guard/google-oauth-callback.guard';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { MicrosoftOAuthGuard } from './guard/microsoft-oauth.guard';
import { MicrosoftOAuthCallbackGuard } from './guard/microsoft-oauth-callback.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user.email, req.body.senha);
  }

  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  async googleAuth(@Request() req) {

  }

  @Get('google-redirect')
  @UseGuards(GoogleOAuthCallbackGuard)
  async googleAuthRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }
  @Get('microsoft')
@UseGuards(MicrosoftOAuthGuard)
async microsoftAuth(@Request() req) {
  // Essa rota inicia o login via Microsoft
}

@Get('microsoft-redirect')
@UseGuards(MicrosoftOAuthCallbackGuard)
async microsoftAuthRedirect(@Request() req) {
  return this.authService.microsoftLogin(req);
}
}
