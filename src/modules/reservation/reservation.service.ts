import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from 'src/modules/reservation/dto/request-reservation.dto';
import { ReservationRepository } from 'src/modules/reservation/reservation.repository';

@Injectable()
export class ReservationService {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  async getReservations(userId: string) {
    return this.reservationRepository.getAllOwned(userId);
  }

  async createReservation(reservation: CreateReservationDto) {
    return this.reservationRepository.create(reservation);
  }
}
