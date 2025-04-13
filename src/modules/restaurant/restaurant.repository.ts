import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId, Types } from 'mongoose';
import {
  Restaurant,
  RestaurantDocument,
} from 'src/modules/restaurant/restaurant.schema';

@Injectable()
export class RestaurantRepository {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  async getModel(): Promise<Model<RestaurantDocument>> {
    return this.restaurantModel;
  }

  async getAll(): Promise<RestaurantDocument[]> {
    return this.restaurantModel.find().exec();
  }

  async getById(id: Types.ObjectId): Promise<RestaurantDocument> {
    const restaurant = await this.restaurantModel.findById(id).exec();
    if (!restaurant) {
      throw new HttpException('Restaurant not found', HttpStatus.NOT_FOUND);
    }
    return restaurant;
  }

  async create(restaurant: Partial<Restaurant>): Promise<RestaurantDocument> {
    try {
      const newRestaurant = new this.restaurantModel(restaurant);
      return await newRestaurant.save();
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB duplicate key error code
        throw new HttpException(
          'Restaurant name is already in use.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(
    id: Types.ObjectId,
    restaurant: Partial<Restaurant>,
  ): Promise<RestaurantDocument> {
    try {
      const updatedRestaurant = await this.restaurantModel
        .findByIdAndUpdate(id, restaurant, { new: true })
        .exec();
      if (!updatedRestaurant) {
        throw new HttpException('Restaurant not found', HttpStatus.NOT_FOUND);
      }
      return updatedRestaurant;
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB duplicate key error code
        throw new HttpException(
          'Restaurant name is already in use.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async delete(id: Types.ObjectId): Promise<RestaurantDocument> {
    const deletedRestaurant = await this.restaurantModel
      .findByIdAndDelete(id)
      .exec();
    if (!deletedRestaurant) {
      throw new HttpException('Restaurant not found', HttpStatus.NOT_FOUND);
    }
    return deletedRestaurant;
  }
}
