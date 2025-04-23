import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmpty, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { Types } from 'mongoose';
import { IsFutureDate, IsStartBeforeEnd } from 'src/common/validator/validator';

export class CreateReservationRequest {
  @IsEmpty()
  restaurantId: Types.ObjectId;

  @IsEmpty()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Number of seats must be a positive number' })
  @ApiProperty({
    description: 'Number of seats reserved',
    example: 4,
    type: Number,
  })
  seats: number;

  @IsNotEmpty()
  @IsDate()
  @IsStartBeforeEnd('endTime', {
    message: 'Start time must be before end time',
  })
  @IsFutureDate()
  @ApiProperty({
    description: 'Start time of the reservation',
    example: '2023-10-01T12:00:00Z',
    type: Date,
  })
  startTime: Date;

  @IsNotEmpty()
  @IsDate()
  @IsFutureDate()
  @ApiProperty({
    description: 'End time of the reservation',
    example: '2023-10-01T14:00:00Z',
    type: Date,
  })
  endTime: Date;
}

export class UpdateReservationRequest extends PartialType(
  CreateReservationRequest,
) {}
