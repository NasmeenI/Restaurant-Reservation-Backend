import { Restaurant } from "src/modules/restaurant/schema/restaurant.schema";

export type AvailableSeatsCount = {
    time: Date;
    seats: number;
}

export class ResponseRestaurantWithReservation {
    restaurant: Restaurant;
    availableSeats: AvailableSeatsCount[];
}