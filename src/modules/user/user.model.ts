import { Prop, Schema } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop()
  username: string;

  @Prop()
  password: string;

  @Prop()
  email: string;

  @Prop()
  role: string;

  @Prop()
  phone: string;

  @Prop()
  createAt: Date;

  @Prop()
  updateAt: Date;
}
