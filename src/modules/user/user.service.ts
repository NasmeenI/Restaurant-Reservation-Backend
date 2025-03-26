import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  LoginRequest,
  RegisterRequest,
  TokenResponse,
} from 'src/modules/user/user.dto';
import { User, UserDocument } from 'src/modules/user/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    const user = await this.getByEmail(email);

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  async create(req: RegisterRequest): Promise<UserDocument> {
    try {
      const user = new this.userModel(req);
      return await user.save();
    } catch (error) {
      if (error.code === 11000) {
        // MongoDB duplicate key error code
        throw new HttpException(
          'Email address is already in use.',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new HttpException(
        `User with email ${email} not register yet`,
        HttpStatus.NOT_FOUND,
      );
    }
    return user;
  }

  async generateToken(user: UserDocument): Promise<TokenResponse> {
    const payload = { email: user.email, sub: user._id };
    const tokenRes: TokenResponse = {
      token: this.jwtService.sign(payload),
    };
    return tokenRes;
  }
}
