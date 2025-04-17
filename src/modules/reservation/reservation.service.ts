import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateReservationRequest, UpdateReservationRequest } from 'src/modules/reservation/dto/request-reservation.dto';
import { ReservationRepository } from 'src/modules/reservation/reservation.repository';

@Injectable()
export class ReservationService {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  async getReservationById(reservationId: string) {
    const reservationObjectId = new Types.ObjectId(reservationId);
    return this.reservationRepository.getById(reservationObjectId);
  }

  async getReservations(userId: string) {
    const userObjectId = new Types.ObjectId(userId);
    return this.reservationRepository.getAllOwned(userObjectId);
  }

  async createReservation(reservation: CreateReservationRequest) {
    return this.reservationRepository.create(reservation);
  }

  async updateReservation(reservationId: string, reservation: UpdateReservationRequest) {
    const reservationObjectId = new Types.ObjectId(reservationId);
    return this.reservationRepository.update(reservationObjectId, reservation);
  }

  async deleteReservation(reservationId: string) {
    const reservationObjectId = new Types.ObjectId(reservationId);
    return this.reservationRepository.delete(reservationObjectId);
  }
}
