import { Module } from '@nestjs/common';
import { ProfileController } from 'src/profile/profile.controller';
import { ProfileService } from 'src/profile/profile.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, PrismaService],
})
export class ProfileModule {}
