import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from 'src/modules/app/app.service';
import { AuthModule } from 'src/modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [AuthModule, ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
