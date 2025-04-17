import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema({ versionKey: false })
export class Reservation extends Document<Types.ObjectId> {
  @Prop({ required: true })
  restaurantId: Types.ObjectId;

  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  seats: number;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
export type ReservationDocument = HydratedDocument<Reservation>;

ReservationSchema.pre('save', async function (next) {
  this.updatedAt = new Date(Date.now());

  if (!this.createdAt) {
    this.createdAt = new Date(Date.now());
  }
  next();
});
