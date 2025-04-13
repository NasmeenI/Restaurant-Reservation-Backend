import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Reservation,
  ReservationDocument,
} from 'src/modules/reservation/schema/reservation.schema';

@Injectable()
export class ReservationRepository {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<ReservationDocument>,
  ) {}

  async getModel(): Promise<Model<ReservationDocument>> {
    return this.reservationModel;
  }

  async getAllOwned(userId: string): Promise<ReservationDocument[]> {
    return this.reservationModel.find({ userId }).exec();
  }

  async getAllByRestaurant(
    restaurantId: string,
  ): Promise<ReservationDocument[]> {
    return this.reservationModel.find({ restaurantId }).exec();
  }

  async getById(id: string): Promise<ReservationDocument> {
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
}
