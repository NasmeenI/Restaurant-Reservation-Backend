import { PartialType } from "@nestjs/mapped-types";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString, Matches } from "class-validator";
import { RestaurantType } from "src/common/enum";
import { IsOpenBeforeClose } from "src/common/validator/validator";

export class CreateRestaurantRequest {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(RestaurantType, { message: 'Invalid restaurant type' })
  type: RestaurantType;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  address: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?\d{10,15}$/, { message: "Phone number must be numbers with 10-15 characters" })
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

  @IsNumber()
  @IsNotEmpty()
  maxSeats: number;
}

export class UpdateRestaurantRequest extends PartialType(
  CreateRestaurantRequest,
) {}