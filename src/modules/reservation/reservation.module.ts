import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationReminderService } from './reservation-reminder.service';
import { ReservationController } from './reservation.controller';
import { RepositoryModule } from 'src/database/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [ReservationController],
  providers: [
    ReservationService,
    ReservationReminderService,
  ],
})
export class ReservationModule {}
