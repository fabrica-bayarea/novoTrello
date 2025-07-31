import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../src/prisma/prisma.service';
import * as argon2 from 'argon2';
import { Role, User } from '@prisma/client';
import { SignInDto } from 'src/auth/dto/signin.dto';
import { ResetPasswordDto } from 'src/auth/dto/reset-password.dto';
import { SignUpDto } from 'src/auth/dto/signup.dto';
import { ForgotPasswordDto } from 'src/email/dto/forgot-password.dto';
import { VerifyResetCodeDto } from 'src/auth/dto/verify-reset-code.dto';
import { ChangePasswordDto } from '../../src//auth/dto/change-password.dto';
import { App } from 'supertest/types';

export async function createTestUser(
  prismaService: PrismaService,
  email: string,
  passwordPlain: string,
  userName: string,
  name: string,
  role: Role = Role.ADMIN,
  resetToken?: string,
  resetTokenExpiresAt?: Date,
): Promise<User> {
  const hashedPassword = await argon2.hash(passwordPlain, {
    type: argon2.argon2id,
  });
  return prismaService.user.create({
    data: {
      email,
      userName,
      name,
      passwordHash: hashedPassword,
      authProvider: 'local',
      role,
      resetToken,
      resetTokenExpiresAt,
    },
  });
}

export function performSignUp(app: INestApplication, signUpDto: SignUpDto) {
  return request(app.getHttpServer() as App)
    .post('/v1/auth/signup')
    .send(signUpDto);
}

export function performSignIn(app: INestApplication, signInDto: SignInDto) {
  return request(app.getHttpServer() as App)
    .post('/v1/auth/signin')
    .send(signInDto);
}

export function initiateForgotPassword(
  app: INestApplication,
  forgotPasswordDto: ForgotPasswordDto,
) {
  return request(app.getHttpServer() as App)
    .patch('/v1/auth/forgot-password')
    .send(forgotPasswordDto);
}

export async function getResetCodeFromDb(
  prismaService: PrismaService,
  email: string,
): Promise<string> {
  const userInDb = await prismaService.user.findUnique({ where: { email } });
  return userInDb?.resetToken as string;
}

export function performVerifyResetCode(
  app: INestApplication,
  verifyResetCodeDto: VerifyResetCodeDto,
) {
  return request(app.getHttpServer() as App)
    .post('/v1/auth/verify-reset-code')
    .send(verifyResetCodeDto);
}

export function performResetPassword(
  app: INestApplication,
  resetPasswordDto: ResetPasswordDto,
  cookie: string,
) {
  return request(app.getHttpServer() as App)
    .post('/v1/auth/reset-password')
    .set('Cookie', cookie)
    .send(resetPasswordDto);
}

export function performChangePassword(
  app: INestApplication,
  changePasswordDto: ChangePasswordDto,
  cookie: string,
) {
  return request(app.getHttpServer() as App)
    .put('/v1/auth/change-password')
    .set('Cookie', cookie)
    .send(changePasswordDto);
}

export function extractCookie(
  response: request.Response,
  cookieName: string,
): string | undefined {
  const setCookieHeader = response.headers['set-cookie'];
  if (!setCookieHeader) return undefined;

  const cookieHeadersArray = Array.isArray(setCookieHeader)
    ? setCookieHeader
    : [setCookieHeader];

  const cookie = cookieHeadersArray.find((c: string) =>
    c.startsWith(`${cookieName}=`),
  ) as string | undefined;
  return cookie;
}

export function extractTokenFromCookie(cookie: string): string | undefined {
  return cookie.split(';')[0].split('=')[1];
}
