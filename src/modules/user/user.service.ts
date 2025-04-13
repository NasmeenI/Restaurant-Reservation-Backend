import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import {
  RegisterRequest,
  TokenResponse,
} from 'src/modules/user/user.dto';
import { UserDocument } from 'src/modules/user/user.schema';
import { UserRepository } from 'src/modules/user/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
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
    const userModel = await this.userRepository.getModel();
    const user = new userModel(req);
    return await user.save();
  }

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.userRepository.getByEmail(email);
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
