import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({ versionKey: false })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  username: string;

  @Prop()
  role: string;

  @Prop()
  phone: string;

  @Prop({ default: Date.now })
  createAt: Date;

  @Prop({ default: Date.now })
  updateAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = User & Document;

UserSchema.pre('save', async function (next) {
  this.updateAt = new Date(Date.now());

  if (!this.createAt) {
    this.createAt = new Date(Date.now());
  }

  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
