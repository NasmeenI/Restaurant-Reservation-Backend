import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RestaurantRepository } from "src/modules/restaurant/restaurant.repository";
import { Restaurant, RestaurantSchema } from "src/modules/restaurant/restaurant.schema";
import { UserRepository } from "src/modules/user/user.repository";
import { User, UserSchema } from "src/modules/user/user.schema";

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: Restaurant.name, schema: RestaurantSchema },
      ]),
    ],
    providers: [UserRepository, RestaurantRepository],
    exports: [UserRepository, RestaurantRepository],
  })
  export class RepositoryModule {}