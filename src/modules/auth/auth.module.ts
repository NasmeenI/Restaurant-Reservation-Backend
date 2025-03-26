import { Module } from '@nestjs/common';
import { AuthService } from 'src/modules/auth/auth.service';
import { AuthController } from 'src/modules/auth/auth.controller';

@Module({
  imports: [],
  controllers: [AuthController],
  providers: [AuthService],
})

export class AuthModule {}
