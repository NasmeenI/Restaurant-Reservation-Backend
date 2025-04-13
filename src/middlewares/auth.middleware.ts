import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { UserRepository } from 'src/modules/user/user.repository';

@Injectable()
export class JWTAuthGuard implements CanActivate {
  constructor(
    private readonly configService: ConfigService,
    private readonly userRepository: UserRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const authHeader = req.headers['authorization'];
    const jwtSecret = this.configService.get<string>('JWT_SECRET');
    if (!jwtSecret) {
      throw new InternalServerErrorException('JWT secret not configured');
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.split('Bearer ')[1];

    try {
      const decoded = jwt.verify(token, jwtSecret);
      if (typeof decoded !== 'object' || !('email' in decoded)) {
        throw new UnauthorizedException('Invalid token payload');
      }
      const user = await this.userRepository.getByEmail(decoded.email);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      req['user'] = user; // Attach to request
      return true
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

@Injectable()
export class AllowedRolesGuard implements CanActivate {
  constructor(private allowedRoles: string[]) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }
    if (!this.allowedRoles.includes(user.role)) {
      throw new UnauthorizedException(
        'You do not have the required role to access this resource',
      );
    }
    return true;
  }
}
export function RolesGuard(allowedRoles: string[]) {
  return new AllowedRolesGuard(allowedRoles);
}
