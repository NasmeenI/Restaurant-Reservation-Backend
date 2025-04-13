import { Module } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from 'src/modules/user/user.controller';
import { User, UserSchema } from 'src/modules/user/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserRepository } from 'src/modules/user/user.repository';
import { RepositoryModule } from 'src/common/database/repository.module';

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
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
