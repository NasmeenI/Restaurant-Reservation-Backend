import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/modules/user/schema/user.schema';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async getModel(): Promise<Model<UserDocument>> {
    return this.userModel;
  }

  async getByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getById(id: Types.ObjectId): Promise<UserDocument> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async create(user: Partial<User>): Promise<UserDocument> {
    try {
      const newUser = new this.userModel(user);
      return await newUser.save();
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

  async update(id: Types.ObjectId, user: Partial<User>): Promise<UserDocument> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, user, {
          new: true,
          runValidators: true,
        })
        .exec();
      if (!updatedUser) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      return updatedUser;
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

  async delete(id: Types.ObjectId): Promise<UserDocument> {
    const deletedUser = await this.userModel.findByIdAndDelete(id).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return deletedUser;
  }
}
