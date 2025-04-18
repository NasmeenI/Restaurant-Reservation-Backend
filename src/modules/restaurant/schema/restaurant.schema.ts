import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Matches } from 'class-validator';
import { Document, HydratedDocument, Types } from 'mongoose';
import { RestaurantType } from 'src/common/enum';

@Schema({ versionKey: false })
export class Restaurant extends Document<Types.ObjectId> {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop({ required: true })
  type: RestaurantType;

  @Prop({ required: true })
  address: string;

  @Prop({ required: true })
  @Matches(/^\+?\d{10,15}$/, {
    message: 'Phone number must be numbers with 10-15 characters',
  })
  phone: string;

  @Prop({ required: true })
  @Matches(/^([01]\d|2[0-3])\.[0-5]\d$/, {
    message: 'Open time must be in the format HH.MM',
  })
  openTime: string;

  @Prop({ required: true })
  @Matches(/^([01]\d|2[0-3])\.[0-5]\d$/, {
    message: 'Close time must be in the format HH.MM',
  })
  closeTime: string;

  @Prop({ required: true })
  maxSeats: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
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
