import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Patch,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JWTAuthGuard } from 'src/middlewares/auth.middleware';
import {
  LoginRequest,
  OTPRequest,
  RegisterRequest,
} from 'src/modules/user/dto/request-user.dto';
import { UserResponse } from 'src/modules/user/dto/response-user.dto';
import { UserService } from 'src/modules/user/user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  async login(@Body() loginRequest: LoginRequest, @Response() res) {
    const user = await this.userService.validateUser(
      loginRequest.email,
      loginRequest.password,
    );
    const response = await this.userService.generateToken(user);
    return res.status(HttpStatus.OK).json(response);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register user' })
  async register(@Body() registerRequest: RegisterRequest, @Response() res) {
    const user = await this.userService.create(registerRequest);
    const response = await this.userService.generateToken(user);
    return res.status(HttpStatus.CREATED).json(response);
  }

  // TODO: Implement logout to invalidate the token in cookies

  @Get('/me')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'Get user data' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User data retrieved successfully',
    type: UserResponse,
  })
  async getMe(@Request() req, @Response() res) {
    const user = req['user'];
    const userData = await this.userService.getByEmail(user.email);
    if (!userData) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'User not found',
      });
    }

    const userResponse = new UserResponse(userData);
    return res.status(HttpStatus.OK).json(userResponse);
  }

  @Patch('/verify')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'Verify user with OTP' })
  async verifyUser(
    @Body() otpRequest: OTPRequest,
    @Request() req,
    @Response() res,
  ) {
    const user = req['user'];
    const userData = await this.userService.getByEmail(user.email);
    if (!userData) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'User not found',
      });
    }

    const updatedUser = await this.userService.verifyUser(otpRequest, userData);
    const userResponse = new UserResponse(updatedUser);
    return res.status(HttpStatus.OK).json(userResponse);
  }

  @Patch('resent-otp')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({ summary: 'Resend OTP to user' })
  async resentOtp(@Request() req, @Response() res) {
    const user = req['user'];
    const userData = await this.userService.getByEmail(user.email);
    if (!userData) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'User not found',
      });
    }

    await this.userService.resentOtp(userData);
    return res.status(HttpStatus.OK).json({
      message: 'OTP resent successfully',
    });
  }
}
