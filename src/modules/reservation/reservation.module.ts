import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { UserModule } from 'src/modules/user/user.module';
import { RestaurantModule } from "src/modules/restaurant/restaurant.module";
import { ReservationReminderService } from './reservation-reminder.service';
import { ReservationController } from './reservation.controller';
import { RepositoryModule } from 'src/database/repository.module';
import { TwilioModule } from 'src/modules/twilio/twilio.module';
import { TwilioService } from 'src/modules/twilio/twilio.service';

@Module({
  imports: [
    RepositoryModule, 
    TwilioModule,
    UserModule,
    RestaurantModule
  ],
  controllers: [ReservationController],
  providers: [
    ReservationService, 
    ReservationReminderService, 
    TwilioService,
    // UserService,
    // RestaurantService
  ],
})
export class ReservationModule {}
