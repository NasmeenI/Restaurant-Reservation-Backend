import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema({ versionKey: false })
export class Reservation extends Document<Types.ObjectId> {
  @ApiProperty({
    description: 'ID of the reservation',
    example: '60d5f484f1a2c8b8f8e4b8c8',
    type: String,
  })
  declare _id: Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty({
    description: 'ID of the restaurant',
    example: '60d5f484f1a2c8b8f8e4b8c8',
    type: String,
  })
  restaurantId: Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty({
    description: 'ID of the reserver',
    example: '60d5f484f1a2c8b8f8e4b8c8',
    type: String,
  })
  userId: Types.ObjectId;

  @Prop({ required: true })
  @ApiProperty({
    description: 'Number of seats reserved',
    example: 4,
    type: Number,
  })
  seats: number;

  @Prop({ required: true })
  @ApiProperty({
    description: 'Start time of the reservation',
    example: '2023-10-01T12:00:00Z',
    type: Date,
  })
  startTime: Date;

  @Prop({ required: true })
  @ApiProperty({
    description: 'End time of the reservation',
    example: '2023-10-01T14:00:00Z',
    type: Date,
  })
  endTime: Date;

  @Prop({ default: false })
  @ApiProperty({
    description: 'Whether the reminder has been sent',
    example: false,
    type: Boolean,
  })
  reminderSent: boolean;

  @Prop({ default: Date.now })
  @ApiProperty({
    description: 'Created date of the reservation',
    example: '2023-10-01T12:00:00Z',
    type: Date,
  })
  createdAt: Date;

  @Prop({ default: Date.now })
  @ApiProperty({
    description: 'Updated date of the reservation',
    example: '2023-10-01T12:00:00Z',
    type: Date,
  })
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
