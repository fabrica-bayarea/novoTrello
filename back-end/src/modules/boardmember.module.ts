import { Module } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { BoardMemberService } from 'src/services/boardmember.service';
import { BoardMemberController } from 'src/controllers/boardmember.controller';

@Module({
  controllers: [BoardMemberController],
  providers: [BoardMemberService, PrismaService],
})

export class BoardMemberModule {}
