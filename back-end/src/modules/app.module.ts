import { Module } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { AuthModule } from 'src/modules/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'src/modules/prisma.module';
import { BoardModule } from './board.module';

@Module({
  imports: [ 
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }), 
    PrismaModule, 
    AuthModule.register(),
    BoardModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
