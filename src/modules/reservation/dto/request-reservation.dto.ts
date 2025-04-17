import { PartialType } from '@nestjs/mapped-types';
import { IsDate, IsEmpty, IsNotEmpty, IsNumber } from 'class-validator';
import { Types } from 'mongoose';
import { IsFutureDate, IsStartBeforeEnd } from 'src/common/validator/validator';

export class CreateReservationRequest {
  @IsEmpty()
  restaurantId: Types.ObjectId;

  @IsEmpty()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  seats: number;

  @IsNotEmpty()
  @IsDate()
  @IsStartBeforeEnd('endTime', {
    message: 'Start time must be before end time',
  })
  @IsFutureDate()
  startTime: Date;

  @IsNotEmpty()
  @IsDate()
  @IsFutureDate()
  endTime: Date;
}

export class UpdateReservationRequest extends PartialType(CreateReservationRequest) {}