import { Module } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { UserController } from 'src/modules/user/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RepositoryModule } from 'src/database/repository.module';
import { TwilioModule } from 'src/modules/twilio/twilio.module';
import { TwilioService } from 'src/modules/twilio/twilio.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    RepositoryModule,
    TwilioModule,
  ],
  controllers: [UserController],
  providers: [
    UserService,
    TwilioService,
  ],
  exports: [UserService],
})
export class UserModule {}
