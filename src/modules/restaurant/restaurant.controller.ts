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
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Role } from 'src/common/enum';
import { JWTAuthGuard, RolesGuard } from 'src/middlewares/auth.middleware';
import { CreateRestaurantRequest, UpdateRestaurantRequest } from 'src/modules/restaurant/dto/request-restaurant.dto';
import { RestaurantService } from 'src/modules/restaurant/restaurant.service';

@ApiTags('restaurants')
@Controller('restaurants')
@UseGuards(JWTAuthGuard)
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @UseGuards(RolesGuard([Role.ADMIN, Role.USER]))
  async getRestaurants(@Response() res) {
    const response = await this.restaurantService.getRestaurants();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get(':id')
  @UseGuards(RolesGuard([Role.ADMIN, Role.USER]))
  async getRestaurantById(@Param('id') id: string, @Response() res) {
    const objectId = new Types.ObjectId(id);
    if (!Types.ObjectId.isValid(id)) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        message: 'Invalid id',
      });
    }
    const response = await this.restaurantService.getIncludedReservations(objectId);
    return res.status(HttpStatus.OK).json(response);
  }

  @Post()
  @UseGuards(RolesGuard([Role.ADMIN]))
  async createRestaurant(
    @Body() request: CreateRestaurantRequest,
    @Response() res,
  ) {
    const response = await this.restaurantService.createRestaurant(request);
    return res.status(HttpStatus.CREATED).json(response);
  }

  @Patch(':id')
  @UseGuards(RolesGuard([Role.ADMIN]))
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
  @UseGuards(RolesGuard([Role.ADMIN]))
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
