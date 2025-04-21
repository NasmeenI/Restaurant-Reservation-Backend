import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Reservation,
  ReservationDocument,
} from 'src/modules/reservation/schema/reservation.schema';
import { ReservedSeatsCount } from 'src/modules/restaurant/dto/response-restaurant';
import { Restaurant } from 'src/modules/restaurant/schema/restaurant.schema';

@Injectable()
export class ReservationRepository {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
  ) {}

  async getModel(): Promise<Model<ReservationDocument>> {
    return this.reservationModel;
  }

  async getAll(): Promise<ReservationDocument[]> {
    return this.reservationModel.find().exec();
  }

  async getAllOwned(userId: Types.ObjectId): Promise<ReservationDocument[]> {
    return this.reservationModel.find({ userId }).exec();
  }

  async getAllByRestaurant(
    restaurantId: Types.ObjectId,
  ): Promise<ReservationDocument[]> {
    return this.reservationModel.find({ restaurantId }).exec();
  }

  async getById(id: Types.ObjectId): Promise<ReservationDocument> {
    const reservation = await this.reservationModel.findById(id).exec();
    if (!reservation) {
      throw new HttpException('Reservation not found', HttpStatus.NOT_FOUND);
    }
    return reservation;
  }

  async create(
    reservation: Partial<Reservation>,
  ): Promise<ReservationDocument> {
    try {
      const newReservation = new this.reservationModel(reservation);
      return await newReservation.save();
    } catch (error) {
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: Types.ObjectId,
    reservation: Partial<Reservation>,
  ): Promise<ReservationDocument> {
    const updatedReservation = await this.reservationModel
      .findByIdAndUpdate(id, reservation, { new: true })
      .exec();
    if (!updatedReservation) {
      throw new HttpException('Reservation not found', HttpStatus.NOT_FOUND);
    }
    return updatedReservation;
  }

  async delete(id: Types.ObjectId): Promise<ReservationDocument> {
    const deletedReservation = await this.reservationModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedReservation) {
      throw new HttpException('Reservation not found', HttpStatus.NOT_FOUND);
    }
    return deletedReservation;
  }

  async countAvailableSeatsSlot(
    restaurant: Restaurant,
  ): Promise<ReservedSeatsCount[]> {
    const reservations = await this.getAllByRestaurant(restaurant._id);

    const reserveMap = new Map<string, number>();

    for (const reservation of reservations) {
      const startKey = reservation.startTime.toISOString();
      const endKey = reservation.endTime.toISOString();

      reserveMap.set(
        startKey,
        (reserveMap.get(startKey) ?? 0) + reservation.seats,
      );
      reserveMap.set(endKey, (reserveMap.get(endKey) ?? 0) - reservation.seats);
    }

    // Sort the map by timestamp (ISO string)
    const sortedReserveMap = new Map(
      Array.from(reserveMap.entries()).sort(([a], [b]) => a.localeCompare(b)),
    );

    let currentSeats = 0;
    const availableSeats: ReservedSeatsCount[] = [];
    for (const [key, value] of sortedReserveMap.entries()) {
      currentSeats += value;
      const time = new Date(key);
      availableSeats.push({
        time: time,
        seats: currentSeats,
      });
    }

    return availableSeats;
  }
}
