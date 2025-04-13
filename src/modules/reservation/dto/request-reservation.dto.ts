import { IsDate, IsEmpty, IsNotEmpty, IsNumber } from 'class-validator';
import { Types } from 'mongoose';
import { IsStartBeforeEnd } from 'src/common/validator/validator';

export class CreateReservationDto {
  @IsEmpty()
  restaurantId: Types.ObjectId;

  @IsEmpty()
  userId: Types.ObjectId;

  @IsNotEmpty()
  @IsNumber()
  capacity: number;

  @IsNotEmpty()
  @IsDate()
  @IsStartBeforeEnd('endTime', {
    message: 'Start time must be before end time',
  })
  startTime: Date;

  @IsNotEmpty()
  @IsDate()
  endTime: Date;
}
