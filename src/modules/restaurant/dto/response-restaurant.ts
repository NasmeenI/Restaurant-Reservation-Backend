import { ApiProperty } from "@nestjs/swagger";
import { Restaurant } from "src/modules/restaurant/schema/restaurant.schema";

export class ReservedSeatsCount {
    @ApiProperty({
        description: 'Start time of the reservation',
        example: '2023-10-01T12:00:00Z',
        type: Date,
    })
    time: Date;
    @ApiProperty({
        description: 'Number of available seats',
        example: 4,
        type: Number,
    })
    seats: number;
}

export class ResponseRestaurantWithReservation {
    @ApiProperty({
        description: 'Restaurant information',
        type: Restaurant,
    })
    restaurant: Restaurant;

    @ApiProperty({
        description: 'List of reserved seats of the restaurant',
        type: [ReservedSeatsCount],
    })
    reservedSeats: ReservedSeatsCount[];
}