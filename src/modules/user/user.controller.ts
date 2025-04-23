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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Role } from 'src/common/enum';
import { JWTAuthGuard, RolesGuard } from 'src/middlewares/auth.middleware';
import {
  LoginRequest,
  OTPRequest,
  RegisterRequest,
} from 'src/modules/user/dto/request-user.dto';
import {
  TokenResponse,
  TokenWithOTP,
  UserResponse,
} from 'src/modules/user/dto/response-user.dto';
import { UserService } from 'src/modules/user/user.service';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged in successfully, token returned',
    type: TokenResponse,
  })
  async login(@Body() loginRequest: LoginRequest, @Response() res) {
    const user = await this.userService.validateUser(
      loginRequest.email,
      loginRequest.password,
    );
    const response = await this.userService.generateToken(user);

    this.userService.setCookie(res, 'token', response.token, {});
    return res.status(HttpStatus.OK).json(response);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register user and send verify OTP' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'User registered successfully, token returned',
    type: TokenResponse,
  })
  async register(@Body() registerRequest: RegisterRequest, @Response() res) {
    const { user, otp } = await this.userService.createUser(registerRequest);
    const tokenRes = await this.userService.generateToken(user);

    this.userService.setCookie(res, 'token', tokenRes.token, {});
    const response: TokenWithOTP = {
      token: tokenRes.token,
      otp: otp.otp,
    };
    return res.status(HttpStatus.CREATED).json(response);
  }

  @Post('/logout')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'User logged out successfully',
  })
  async logout(@Request() req, @Response() res) {
    const user = req['user'];
    const userData = await this.userService.getByEmail(user.email);
    if (!userData) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'User not found',
      });
    }

    this.userService.removeCookie(res, 'token', {});
    return res.status(HttpStatus.OK).json({
      message: 'User logged out successfully',
    });
  }

  @Get('/me')
  @UseGuards(JWTAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get user data',
    description: 'Requires authentication',
  })
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
  @UseGuards(JWTAuthGuard, RolesGuard([Role.GUEST]))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Verify user with OTP',
    description: 'Requires authentication',
  })
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
  @UseGuards(JWTAuthGuard, RolesGuard([Role.GUEST]))
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Resend OTP to user',
    description: 'Requires authentication',
  })
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
