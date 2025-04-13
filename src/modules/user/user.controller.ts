import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/middlewares/auth.middleware';
import { LoginRequest, RegisterRequest, UserResponse } from 'src/modules/user/user.dto';
import { UserService } from 'src/modules/user/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('/login')
  async login(@Body() loginRequest: LoginRequest, @Response() res) {
    const user = await this.userService.validateUser(
      loginRequest.email,
      loginRequest.password,
    );
    const response = await this.userService.generateToken(user);
    return res.status(HttpStatus.OK).json(response);
  }

  @Post('/register')
  async register(@Body() registerRequest: RegisterRequest, @Response() res) {
    const user = await this.userService.create(registerRequest);
    const response = await this.userService.generateToken(user);
    return res.status(HttpStatus.CREATED).json(response);
  }

  // TODO: Implement logout to invalidate the token in cookies

  @Get('/me')
  @UseGuards(AuthGuard)
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
}
