import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from 'src/modules/app/app.service';
import { UserModule } from 'src/modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/common/database/database.module';
import { RestaurantModule } from 'src/modules/restaurant/restaurant.module';
import { ReservationModule } from 'src/modules/reservation/reservation.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    UserModule,
    RestaurantModule,
    ReservationModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
