import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ReservationRepository } from 'src/modules/reservation/reservation.repository';
import {
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
} from 'src/modules/restaurant/dto/request-restaurant.dto';
import {
  ReservedSeatsCount,
  ResponseRestaurantWithReservation,
} from 'src/modules/restaurant/dto/response-restaurant';
import { RestaurantRepository } from 'src/modules/restaurant/restaurant.repository';

@Injectable()
export class RestaurantService {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
    private readonly reservationRepository: ReservationRepository,
  ) {}

  async getRestaurants() {
    return this.restaurantRepository.getAll();
  }

  async getRestaurantById(id: Types.ObjectId) {
    return this.restaurantRepository.getById(id);
  }

  async createRestaurant(restaurant: CreateRestaurantRequest) {
    return this.restaurantRepository.create(restaurant);
  }

  async updateRestaurant(
    id: Types.ObjectId,
    restaurant: UpdateRestaurantRequest,
  ) {
    return this.restaurantRepository.update(id, restaurant);
  }

  async deleteRestaurant(id: Types.ObjectId) {
    return this.restaurantRepository.delete(id);
  }

  async getIncludedReservations(
    restaurantId: Types.ObjectId,
  ): Promise<ResponseRestaurantWithReservation> {
    const thisRestaurant =
      await this.restaurantRepository.getById(restaurantId);
    if (!thisRestaurant) {
      throw new HttpException('Restaurant not found', HttpStatus.NOT_FOUND);
    }
    const availableSeats = await this.reservationRepository.countAvailableSeatsSlot(thisRestaurant);

    const response: ResponseRestaurantWithReservation = {
      restaurant: thisRestaurant,
      reservedSeats: availableSeats,
    };
    return response;
  }

}
