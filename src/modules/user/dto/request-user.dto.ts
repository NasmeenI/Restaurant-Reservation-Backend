import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class LoginRequest {
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Email of the user account',
    example: 'test@gmail.com',
    type: String,
  })
  email: string;

  @IsString()
  @IsNotEmpty()
  // @Matches(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
  //   message:
  //     'Password must be at least 8 characters long',
  // })

  // password must be at least 8 chars, can contain letters, numbers, and special chars
  @Matches(/.{8,}/, {
    message: 'Password must be at least 8 characters long',
  })
  @ApiProperty({
    description: 'Password of the user account',
    example: '12345678',
    type: String,
  })
  password: string;
}

export class RegisterRequest extends LoginRequest {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    description: 'Username of the user account',
    example: 'Tee Nguyen',
    type: String,
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @Matches(/^\+?\d{10,15}$/, {
    message: 'Phone number must be numbers with 10-15 characters',
  })
  @ApiProperty({
    description: 'Phone number of the user account',
    example: '0849876543',
    type: String,
  })
  phone: string;
}

export class OTPRequest {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/, { message: 'OTP must be 6 digits' })
  @ApiProperty({
    description: 'OTP code for verification',
    example: '123456',
    type: String,
  })
  otp: string;
}
