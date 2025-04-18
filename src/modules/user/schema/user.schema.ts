import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enum';
import { Matches } from 'class-validator';

@Schema({ versionKey: false })
export class User extends Document<Types.ObjectId> {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  username: string;

  @Prop({ enum: Role, default: Role.GUEST })
  role: Role;

  @Prop()
  @Matches(/^\+?\d{10,15}$/, { message: "Phone number must be numbers with 10-15 characters" })
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
    this.role = Role.GUEST;
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
