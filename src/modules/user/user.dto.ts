import {
  IsEmail,
  IsEmpty,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsString()
  @IsNotEmpty()
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
