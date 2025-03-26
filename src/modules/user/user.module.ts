import { Module } from '@nestjs/common';
import { UserService } from 'src/modules/user/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from 'src/modules/user/user.controller';

@Module({
  imports: [
    // MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
  ],
  controllers: [UserController],
  providers: [UserService],
})

export class AuthModule {}
