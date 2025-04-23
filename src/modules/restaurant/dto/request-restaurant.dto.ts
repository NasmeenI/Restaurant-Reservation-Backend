import { PartialType } from "@nestjs/mapped-types";
import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsPositive, IsString, Matches } from "class-validator";
import { RestaurantType } from "src/common/enum";
import { IsOpenBeforeClose } from "src/common/validator/validator";

export class CreateRestaurantRequest {
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @ApiProperty({
    description: 'The name of the restaurant',
    example: 'Japanese Restaurant',
    type: String,
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @IsEnum(RestaurantType, { message: 'Invalid restaurant type' })
  @ApiProperty({
    description: 'The type of the restaurant',
    example: RestaurantType.FINE_DINING,
    enum: RestaurantType, 
    enumName: 'RestaurantType',
  })
  type: RestaurantType;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.trim())
  @ApiProperty({
    description: 'The address of the restaurant',
    example: '200/200 Nguyen Van Linh, Tan Phu Ward, District 7, HCM City',
    type: String,
  })
  address: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\+?\d{10,15}$/, { message: "Phone number must be numbers with 10-15 characters" })
  @ApiProperty({
    description: 'The phone number of the restaurant',
    example: '0849876543',
    type: String,
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3])\.[0-5]\d$/, {
    message: 'Open time must be in the format HH.MM',
  })
  @IsOpenBeforeClose('closeTime', {
    message: 'Open time must be before close time',
  })
  @ApiProperty({
    description: 'The open time of the restaurant',
    example: '08.00',
    type: String,
  })
  openTime: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3])\.[0-5]\d$/, {
    message: 'Close time must be in the format HH.MM',
  })
  @ApiProperty({
    description: 'The close time of the restaurant',
    example: '22.00',
    type: String,
  })
  closeTime: string;

  @IsNumber()
  @IsPositive({ message: 'Max seats must be a positive number' })
  @IsNotEmpty()
  @ApiProperty({
    description: 'The maximum seats of the restaurant',
    example: '100',
    type: Number,
  })
  maxSeats: number;
}

export class UpdateRestaurantRequest extends PartialType(
  CreateRestaurantRequest,
) {}