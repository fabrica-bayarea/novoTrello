import { Module } from '@nestjs/common';
import { RolesUsersController } from '../controllers/rolestest.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../guards/roles.guard';
import { JwtAuthGuard } from '../guards/jwt.guard'; // se você tiver isso
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: "JWT_SECRET",
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [RolesUsersController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class RolesUsersModule {}
