import { Injectable } from '@nestjs/common';
import { ReservationRepository } from 'src/modules/reservation/reservation.repository';

@Injectable()
export class ReservationService {
  constructor(private readonly reservationRepository: ReservationRepository) {}
}
