import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { RepositoryModule } from 'src/common/database/repository.module';

@Module({
  imports: [RepositoryModule],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
