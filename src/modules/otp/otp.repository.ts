import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  OtpVerification,
  OtpVerificationDocument,
} from 'src/modules/otp/schema/otp.schema';

@Injectable()
export class OtpVerificationRepository {
  constructor(
    @InjectModel(OtpVerification.name)
    private readonly otpVerificationModel: Model<OtpVerificationDocument>,
  ) {}

  async getModel(): Promise<Model<OtpVerificationDocument>> {
    return this.otpVerificationModel;
  }

  async generateOtp(): Promise<Partial<OtpVerificationDocument>> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
    const otpVerification: Partial<OtpVerificationDocument> = {
      otp,
      expiredAt: new Date(Date.now() + 5 * 60 * 1000), // Set expiration time to 5 minutes from now
    };
    return otpVerification;
  }

  async getById(id: Types.ObjectId): Promise<OtpVerificationDocument> {
    const otpVerification = await this.otpVerificationModel.findById(id).exec();
    if (!otpVerification) {
      throw new NotFoundException('OTP Verification not found');
    }
    return otpVerification;
  }

  async getByUserId(userId: Types.ObjectId): Promise<OtpVerificationDocument> {
    const otpVerifications = await this.otpVerificationModel
      .findOne({ userId })
      .exec();
    if (!otpVerifications) {
      throw new NotFoundException('No OTP Verification found for this user');
    }
    return otpVerifications;
  }

  async create(userId: Types.ObjectId): Promise<OtpVerificationDocument> {
    const otpVerification = await this.generateOtp();
    try {
      const newOtpVerification = new this.otpVerificationModel({
        userId,
        otp: otpVerification.otp,
        expiredAt: otpVerification.expiredAt,
      });
      return await newOtpVerification.save();
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create OTP Verification',
      );
    }
  }

  async refresh(userId: Types.ObjectId): Promise<OtpVerificationDocument> {
    try {
      const existingOtpVerification = await this.getByUserId(userId);
      const newOtp = await this.generateOtp();
      const updatedOtpVerification = await this.otpVerificationModel
        .findByIdAndUpdate(existingOtpVerification._id, newOtp, { new: true })
        .exec();
      if (!updatedOtpVerification) {
        throw new NotFoundException('OTP Verification not found');
      }
      return updatedOtpVerification;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to refresh OTP Verification',
      );
    }
  }

  async delete(id: Types.ObjectId): Promise<OtpVerificationDocument> {
    try {
      const deletedOtpVerification = await this.otpVerificationModel
        .findByIdAndDelete(id)
        .exec();
      if (!deletedOtpVerification) {
        throw new NotFoundException('OTP Verification not found');
      }
      return deletedOtpVerification;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to delete OTP Verification',
      );
    }
  }
}
