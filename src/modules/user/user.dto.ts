import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { UserDocument } from 'src/modules/user/user.schema';

export class LoginRequest {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterRequest extends LoginRequest {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\d+$/, { message: 'Phone number must contain only numbers' })
  phone: string;
}

export class UpdateUserRequest {
  @IsString()
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  phone: string;

  @IsString()
  @IsOptional()
  role: string;
}

export class ChangePasswordRequest {
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  newPassword: string;
}

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
