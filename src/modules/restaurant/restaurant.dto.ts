import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsString, Matches } from 'class-validator';
import { IsOpenBeforeClose } from 'src/common/validator/validator';

export class BaseRestaurantRequest {
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d+$/, { message: 'Phone number must contain only numbers' })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3])\.[0-5]\d$/, {
    message: 'Open time must be in the format HH.MM',
  })
  @IsOpenBeforeClose('closeTime', {
    message: 'Open time must be before close time',
  })
  openTime: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3])\.[0-5]\d$/, {
    message: 'Close time must be in the format HH.MM',
  })
  closeTime: string;
}

export class CreateRestaurantRequest extends BaseRestaurantRequest {
  @IsNotEmpty()
  declare name: string;

  @IsNotEmpty()
  declare type: string;

  @IsNotEmpty()
  declare address: string;

  @IsNotEmpty()
  declare phone: string;

  @IsNotEmpty()
  declare openTime: string;

  @IsNotEmpty()
  declare closeTime: string;
}

export class UpdateRestaurantRequest extends BaseRestaurantRequest {
  @Optional()
  declare name: string;

  @Optional()
  declare type: string;

  @Optional()
  declare address: string;

  @Optional()
  declare phone: string;

  @Optional()
  declare openTime: string;

  @Optional()
  declare closeTime: string;
}
