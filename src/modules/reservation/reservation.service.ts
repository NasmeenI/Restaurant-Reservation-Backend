import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  CreateReservationRequest,
  UpdateReservationRequest,
} from 'src/modules/reservation/dto/request-reservation.dto';
import { ReservationRepository } from 'src/modules/reservation/reservation.repository';
import { Reservation } from 'src/modules/reservation/schema/reservation.schema';
import { RestaurantRepository } from 'src/modules/restaurant/restaurant.repository';

@Injectable()
export class ReservationService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly restaurantRepository: RestaurantRepository,
  ) {}

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

  async updateReservation(
    reservationId: string,
    reservation: UpdateReservationRequest,
  ) {
    const reservationObjectId = new Types.ObjectId(reservationId);
    return this.reservationRepository.update(reservationObjectId, reservation);
  }

  async deleteReservation(reservationId: string) {
    const reservationObjectId = new Types.ObjectId(reservationId);
    return this.reservationRepository.delete(reservationObjectId);
  }

  async checkIsExceedMaxSeats(
    restaurantId: Types.ObjectId,
    startTime: Date,
    endTime: Date,
    seats: number,
  ) : Promise<boolean> {
    const restaurant = await this.restaurantRepository.getById(restaurantId);
    if (!restaurant) {
      throw new HttpException('Restaurant not found', HttpStatus.NOT_FOUND);
    }

    const maxSeats = restaurant.maxSeats;
    const availableSeats = await this.reservationRepository.countAvailableSeatsSlot(restaurant);

    console.log("Available Seats: ", availableSeats);
    let startTimeSlot : Date, endTimeSlot : Date;
    for (let i = 0; i < availableSeats.length - 1; i++) {
      startTimeSlot = availableSeats[i].time;
      endTimeSlot = availableSeats[i+1].time;

      // Check if the reservation time slot is intersecting with the available time slot
      if (startTime <= endTimeSlot && startTimeSlot < endTime) {
        console.log("Intersecting Time Slot: ", startTime, endTime, startTimeSlot, endTimeSlot);
        console.log("Seats: ", availableSeats[i].seats);
        if (availableSeats[i].seats + seats > maxSeats) {
          return true; 
        }
      }
    }
    return false; 
  }

  async isReservationOnGoing(reservationId: string): Promise<boolean> {
    const reservationObjectId = new Types.ObjectId(reservationId);
    const reservation = await this.reservationRepository.getById(reservationObjectId);
    const currentTime = new Date();
    return reservation.startTime <= currentTime && reservation.endTime >= currentTime;
  }
}
