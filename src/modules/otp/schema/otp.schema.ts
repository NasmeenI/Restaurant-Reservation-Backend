import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';

@Schema({ versionKey: false })
export class OtpVerification extends Document<Types.ObjectId> {
  @Prop({ required: true })
  userId: Types.ObjectId;

  @Prop({ required: true })
  otp: string;

  @Prop({ default: Date.now })
  expiredAt: Date;
}

export const OtpVerificationSchema =
  SchemaFactory.createForClass(OtpVerification);
export type OtpVerificationDocument = HydratedDocument<OtpVerification>;

OtpVerificationSchema.pre('save', async function (next) {
  this.expiredAt = new Date(Date.now() + 5 * 60 * 1000); // Set expiration time to 5 minutes from now
  next();
});
