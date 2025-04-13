import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Matches } from 'class-validator';
import { RestaurantType } from 'src/common/enum';
import { InheritParentDecorators } from 'src/common/validator/inherit-decoration';
import { IsOpenBeforeClose } from 'src/common/validator/validator';

export class BaseRestaurantRequest {
  @IsString()
  name: string;

  @IsString()
  @IsEnum(RestaurantType, { message: 'Invalid restaurant type' })
  type: RestaurantType;

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
  @InheritParentDecorators()
  @IsNotEmpty()
  declare name: string;

  @InheritParentDecorators()
  @IsNotEmpty()
  declare type: RestaurantType;

  @InheritParentDecorators()
  @IsNotEmpty()
  declare address: string;

  @InheritParentDecorators()
  @IsNotEmpty()
  declare phone: string;

  @InheritParentDecorators()
  @IsNotEmpty()
  declare openTime: string;

  @InheritParentDecorators()
  @IsNotEmpty()
  declare closeTime: string;

  @InheritParentDecorators()
  @IsNotEmpty()
  declare maxCapacity: number;
}

export class UpdateRestaurantRequest extends BaseRestaurantRequest {
  @InheritParentDecorators()
  @IsOptional()
  declare name: string;

  @InheritParentDecorators()
  @IsOptional()
  declare type: RestaurantType;

  @InheritParentDecorators()
  @IsOptional()
  declare address: string;

  @InheritParentDecorators()
  @IsOptional()
  declare phone: string;

  @InheritParentDecorators()
  @IsOptional()
  declare openTime: string;

  @InheritParentDecorators()
  @IsOptional()
  declare closeTime: string;

  @InheritParentDecorators()
  @IsOptional()
  declare maxCapacity: number;
}
