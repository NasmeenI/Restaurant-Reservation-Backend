import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';
import { Document, HydratedDocument, Types } from 'mongoose';
import { RestaurantType } from 'src/common/enum';

@Schema({ versionKey: false })
export class Restaurant extends Document<Types.ObjectId> {
  @ApiProperty({
    description: 'ID of the restaurant',
    example: '60d5f484f1a2c8b8f8e4b8c8',
    type: String,
  })
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  @ApiProperty({
    description: 'Name of the restaurant',
    example: 'Pizza Hut',
    type: String,
  })
  name: string;

  @Prop({ required: true })
  @ApiProperty({
    description: 'Type of the restaurant',
    example: RestaurantType.FAST_FOOD,
    enum: RestaurantType,
    enumName: 'RestaurantType',
  })
  type: RestaurantType;

  @Prop({ required: true })
  @ApiProperty({
    description: 'Address of the restaurant',
    example: '123 Main St, City, Country',
    type: String,
  })
  address: string;

  @Prop({ required: true })
  @Matches(/^\+?\d{10,15}$/, {
    message: 'Phone number must be numbers with 10-15 characters',
  })
  @ApiProperty({
    description: 'Phone number of the restaurant',
    example: '+84123456789',
    type: String,
  })
  phone: string;

  @Prop({ required: true })
  @Matches(/^([01]\d|2[0-3])\.[0-5]\d$/, {
    message: 'Open time must be in the format HH.MM',
  })
  @ApiProperty({
    description: 'Open time of the restaurant',
    example: '08.00',
    type: String,
  })
  openTime: string;

  @Prop({ required: true })
  @Matches(/^([01]\d|2[0-3])\.[0-5]\d$/, {
    message: 'Close time must be in the format HH.MM',
  })
  @ApiProperty({
    description: 'Close time of the restaurant',
    example: '22.00',
    type: String,
  })
  closeTime: string;

  @Prop({ required: true })
  @ApiProperty({
    description: 'Max seats of the restaurant',
    example: 100,
    type: Number,
  })
  maxSeats: number;

  @Prop({ default: Date.now })
  @ApiProperty({
    description: 'Created date of the restaurant',
    example: '2023-10-01T12:00:00Z',
    type: Date,
  })
  createdAt: Date;

  @Prop({ default: Date.now })
  @ApiProperty({
    description: 'Updated date of the restaurant',
    example: '2023-10-01T12:00:00Z',
    type: Date,
  })
  updatedAt: Date;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);
export type RestaurantDocument = HydratedDocument<Restaurant>;

RestaurantSchema.pre('save', async function (next) {
  this.updatedAt = new Date(Date.now());

  if (!this.createdAt) {
    this.createdAt = new Date(Date.now());
  }
  next();
});
