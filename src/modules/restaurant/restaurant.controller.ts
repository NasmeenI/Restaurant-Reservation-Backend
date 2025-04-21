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
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Role } from 'src/common/enum';
import { JWTAuthGuard, RolesGuard } from 'src/middlewares/auth.middleware';
import { CreateRestaurantRequest, UpdateRestaurantRequest } from 'src/modules/restaurant/dto/request-restaurant.dto';
import { ResponseRestaurantWithReservation } from 'src/modules/restaurant/dto/response-restaurant';
import { RestaurantService } from 'src/modules/restaurant/restaurant.service';
import { Restaurant } from 'src/modules/restaurant/schema/restaurant.schema';

@ApiTags('restaurants')
@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @ApiOperation({ summary: 'Get all restaurants' , description: 'Allows only admin and user roles to access this endpoint.'})
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of restaurants',
    type: [Restaurant],
  })
  async getRestaurants(@Response() res) {
    const response = await this.restaurantService.getRestaurants();
    return res.status(HttpStatus.OK).json(response);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get restaurant by ID', description: 'Allows only admin and user roles to access this endpoint.'})
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant details',
    type: ResponseRestaurantWithReservation,
  })
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
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Create a new restaurant', description: 'Allows only admin role to access this endpoint.'})
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Restaurant created successfully',
    type: Restaurant,
  })
  async createRestaurant(
    @Body() request: CreateRestaurantRequest,
    @Response() res,
  ) {
    const response = await this.restaurantService.createRestaurant(request);
    return res.status(HttpStatus.CREATED).json(response);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Update restaurant by ID', description: 'Allows only admin role to access this endpoint.'})
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant updated successfully',
    type: Restaurant,
  })
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
  @ApiBearerAuth()
  @UseGuards(JWTAuthGuard, RolesGuard([Role.ADMIN]))
  @ApiOperation({ summary: 'Delete restaurant by ID', description: 'Allows only admin role to access this endpoint.'})
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Restaurant deleted successfully',
  })
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
