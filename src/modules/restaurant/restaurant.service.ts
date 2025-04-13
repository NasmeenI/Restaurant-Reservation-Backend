import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import {
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
} from 'src/modules/restaurant/restaurant.dto';
import { RestaurantRepository } from 'src/modules/restaurant/restaurant.repository';

@Injectable()
export class RestaurantService {
  constructor(private readonly restaurantRepository: RestaurantRepository) {}

  async getRestaurants() {
    return this.restaurantRepository.getAll();
  }

  async getRestaurantById(id: Types.ObjectId) {
    return this.restaurantRepository.getById(id);
  }

  async createRestaurant(restaurant: CreateRestaurantRequest) {
    return this.restaurantRepository.create(restaurant);
  }

  async updateRestaurant(id: Types.ObjectId, restaurant: UpdateRestaurantRequest) {
    return this.restaurantRepository.update(id, restaurant);
  }

  async deleteRestaurant(id: Types.ObjectId) {
    return this.restaurantRepository.delete(id);
  }
}
