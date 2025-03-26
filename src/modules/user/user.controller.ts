import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Response,
} from '@nestjs/common';
import { LoginRequest, RegisterRequest } from 'src/modules/user/user.dto';
import { UserService } from 'src/modules/user/user.service';

@Controller('user')
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
    return res
      .status(HttpStatus.CREATED)
      .json(response);
  }
}
