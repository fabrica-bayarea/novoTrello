import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MailModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
