import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/common/enum';
import { OtpVerificationRepository } from 'src/modules/otp/otp.repository';
import {
  OTPRequest,
  RegisterRequest,
} from 'src/modules/user/dto/request-user.dto';
import { TokenResponse } from 'src/modules/user/dto/response-user.dto';
import { UserDocument } from 'src/modules/user/schema/user.schema';
import { UserRepository } from 'src/modules/user/user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly otpVerificationRepository: OtpVerificationRepository,
  ) {}

  async validateUser(email: string, password: string): Promise<UserDocument> {
    try {
      const user = await this.getByEmail(email);

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
      }
      return user;
    } catch (error) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async create(req: RegisterRequest): Promise<UserDocument> {
    const userModel = await this.userRepository.getModel();
    const user = new userModel(req);
    await this.otpVerificationRepository.create(user._id);
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

  async verifyUser(
    otpReq: OTPRequest,
    user: UserDocument,
  ): Promise<UserDocument> {
    const otpVerification = await this.otpVerificationRepository.getByUserId(
      user._id,
    );
    if (!otpVerification) {
      throw new HttpException('OTP not found', HttpStatus.NOT_FOUND);
    }

    if (otpReq.otp !== otpVerification.otp) {
      throw new HttpException('Invalid OTP', HttpStatus.UNAUTHORIZED);
    }
    const currentTime = new Date(Date.now());
    if (currentTime > otpVerification.expiredAt) {
      throw new HttpException('OTP expired', HttpStatus.UNAUTHORIZED);
    }

    const res = await this.userRepository.update(user._id, { role: Role.USER });
    await this.otpVerificationRepository.delete(otpVerification._id);
    return res;
  }

  async resentOtp(user: UserDocument): Promise<void> {
    try {
      await this.otpVerificationRepository.refresh(user._id);
    } catch (error) {
      console.log(error);
      throw new HttpException(
        'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
