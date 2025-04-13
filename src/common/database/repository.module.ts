import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { RestaurantRepository } from "src/modules/restaurant/restaurant.repository";
import { Restaurant, RestaurantSchema } from "src/modules/restaurant/schema/restaurant.schema";
import { UserRepository } from "src/modules/user/user.repository";
import { User, UserSchema } from "src/modules/user/schema/user.schema";
import { Reservation, ReservationSchema } from "src/modules/reservation/schema/reservation.schema";
import { ReservationRepository } from "src/modules/reservation/reservation.repository";

@Module({
    imports: [
      MongooseModule.forFeature([
        { name: User.name, schema: UserSchema },
        { name: Restaurant.name, schema: RestaurantSchema },
        { name: Reservation.name, schema: ReservationSchema },
      ]),
    ],
    providers: [UserRepository, RestaurantRepository, ReservationRepository],
    exports: [UserRepository, RestaurantRepository, ReservationRepository],
  })
  export class RepositoryModule {}