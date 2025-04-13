import { Controller, Get } from '@nestjs/common';
import { RestaurantService } from 'src/modules/restaurant/restaurant.service';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

}
