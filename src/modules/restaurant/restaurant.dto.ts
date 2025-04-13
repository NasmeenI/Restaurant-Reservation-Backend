import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { IsOpenBeforeClose } from 'src/common/validator/validator';

export class BaseRestaurantRequest {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsString()
  address: string;

  @IsString()
  @Matches(/^\d+$/, { message: 'Phone number must contain only numbers' })
  phone: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3])\.[0-5]\d$/, {
    message: 'Open time must be in the format HH.MM',
  })
  @IsOpenBeforeClose('closeTime', {
    message: 'Open time must be before close time',
  })
  openTime: string;

  @IsString()
  @Matches(/^([01]\d|2[0-3])\.[0-5]\d$/, {
    message: 'Close time must be in the format HH.MM',
  })
  closeTime: string;

  @IsNumber()
  maxCapacity: number;
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

  @IsNotEmpty()
  declare maxCapacity: number;
}

export class UpdateRestaurantRequest extends BaseRestaurantRequest {
  @IsOptional()
  declare name: string;

  @IsOptional()
  declare type: string;

  @IsOptional()
  declare address: string;

  @IsOptional()
  declare phone: string;

  @IsOptional()
  declare openTime: string;

  @IsOptional()
  declare closeTime: string;

  @IsOptional()
  declare maxCapacity: number;
}
