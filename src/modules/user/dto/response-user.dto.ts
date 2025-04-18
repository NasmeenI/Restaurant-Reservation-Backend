import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/common/enum';
import { UserDocument } from 'src/modules/user/schema/user.schema';

export class TokenResponse {
  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    type: String,
  })
  token: string;
}

export class UserResponse {
  @ApiProperty({
    description: 'User ID',
    example: '60d5f484f1c2b8b8a4e4e4e4',
    type: String,
  })
  _id: string;

  @ApiProperty({
    description: 'User email',
    example: 'test@gmail.com',
    type: String,
  })
  email: string;

  @ApiProperty({
    description: 'User username',
    example: 'Tee Nguyen',
    type: String,
  })
  username?: string;

  @ApiProperty({
    description: 'User role',
    example: Role.USER,
    enum: Role,
    enumName: 'Role',
  })
  role?: string;

  @ApiProperty({
    description: 'User phone number',
    example: '0849876543',
    type: String,
  })
  phone?: string;

  @ApiProperty({
    description: 'User created date',
    example: '2023-10-01T12:00:00Z',
    type: Date,
  })
  createdAt: Date;

  @ApiProperty({
    description: 'User updated date',
    example: '2023-10-01T12:00:00Z',
    type: Date,
  })
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
