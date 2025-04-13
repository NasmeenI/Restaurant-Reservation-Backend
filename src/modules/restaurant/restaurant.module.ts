import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RepositoryModule } from "src/common/database/repository.module";
import { RestaurantController } from "src/modules/restaurant/restaurant.controller";
import { RestaurantRepository } from "src/modules/restaurant/restaurant.repository";
import { Restaurant, RestaurantSchema } from "src/modules/restaurant/restaurant.schema";
import { RestaurantService } from "src/modules/restaurant/restaurant.service";
import { UserRepository } from "src/modules/user/user.repository";

@Module({
  imports: [
    RepositoryModule
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}