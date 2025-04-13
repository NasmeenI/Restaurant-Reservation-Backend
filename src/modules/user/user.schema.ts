import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, ObjectId } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Schema({ versionKey: false })
export class User extends Document<ObjectId> {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  username: string;

  @Prop({ enum: ['Admin', 'User', 'Guest'], default: 'Guest' })
  role: 'Admin' | 'User' | 'Guest';

  @Prop()
  phone: string;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;

UserSchema.pre('save', async function (next) {
  if (!this.role) {
    this.role = 'Guest';
  }
  this.updatedAt = new Date(Date.now());

  if (!this.createdAt) {
    this.createdAt = new Date(Date.now());
  }

  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
