import { Injectable } from "@nestjs/common";
import { RestaurantRepository } from "src/modules/restaurant/restaurant.repository";
import { UserRepository } from "src/modules/user/user.repository";

@Injectable()
export class RestaurantService {
  constructor(
    private readonly restaurantRepository: RestaurantRepository,
  ) {}

}