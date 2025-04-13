import { Injectable } from "@nestjs/common";
import { RestaurantRepository } from "src/modules/restaurant/restaurant.repository";

@Injectable()
export class RestaurantService {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
  ) {}

}