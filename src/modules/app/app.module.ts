import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from 'src/modules/app/app.service';
import { UserModule } from 'src/modules/user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'src/database/database.module';
import { RestaurantModule } from 'src/modules/restaurant/restaurant.module';
import { ReservationModule } from 'src/modules/reservation/reservation.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 1000, // 1 second
          limit: 30,
        },
      ],
      errorMessage: 'Too many requests, please try again later.',
    }),
    DatabaseModule,
    UserModule,
    RestaurantModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
