import { UserDocument } from "src/modules/user/schema/user.schema";

export class TokenResponse {
  token: string;
}

export class UserResponse {
  _id: string;
  email: string;
  username?: string;
  role?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: UserDocument) {
    this._id = user._id.toString(); // Convert ObjectId to string
    this.email = user.email;
    this.username = user.username;
    this.role = user.role;
    this.phone = user.phone;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
