import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Response,
} from '@nestjs/common';
import { Types } from 'mongoose';
import {
  CreateRestaurantRequest,
  UpdateRestaurantRequest,
} from 'src/modules/restaurant/restaurant.dto';
import { RestaurantService } from 'src/modules/restaurant/restaurant.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  async getRestaurants(@Response() res) {
    const response = await this.restaurantService.getRestaurants();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get(':id')
  async getRestaurantById(@Param('id') id: string, @Response() res) {
    const objectId = new Types.ObjectId(id);
    if (!Types.ObjectId.isValid(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid id',
      });
    }
    const response = await this.restaurantService.getRestaurantById(objectId);
    return res.status(HttpStatus.OK).json(response);
  }

  @Post()
  async createRestaurant(
    @Body() request: CreateRestaurantRequest,
    @Response() res,
  ) {
    const response = await this.restaurantService.createRestaurant(request);
    return res.status(HttpStatus.CREATED).json(response);
  }

  @Patch(':id')
  async updateRestaurant(
    @Param('id') id: string,
    @Body() request: UpdateRestaurantRequest,
    @Response() res,
  ) {
    const objectId = new Types.ObjectId(id);
    if (!Types.ObjectId.isValid(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid id',
      });
    }
    const response = await this.restaurantService.updateRestaurant(
      objectId,
      request,
    );
    return res.status(HttpStatus.OK).json(response);
  }

  @Delete(':id')
  async deleteRestaurant(@Param('id') id: string, @Response() res) {
    const objectId = new Types.ObjectId(id);
    if (!Types.ObjectId.isValid(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid id',
      });
    }
    const response = await this.restaurantService.deleteRestaurant(objectId);
    return res.status(HttpStatus.OK).json(response);
  }
}
