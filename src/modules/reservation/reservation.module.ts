import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationReminderService } from './reservation-reminder.service';
import { ReservationController } from './reservation.controller';
import { RepositoryModule } from 'src/database/repository.module';
import { TwilioModule } from 'src/modules/twilio/twilio.module';
import { TwilioService } from 'src/modules/twilio/twilio.service';

@Module({
  imports: [
    RepositoryModule, 
    TwilioModule
  ],
  controllers: [ReservationController],
  providers: [
    ReservationService, 
    ReservationReminderService, 
    TwilioService
  ],
})
export class ReservationModule {}
