import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Response, HttpStatus } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { JWTAuthGuard, RolesGuard } from 'src/middlewares/auth.middleware';
import { Role } from 'src/common/enum';
import { CreateReservationDto } from 'src/modules/reservation/dto/request-reservation.dto';
import { Types } from 'mongoose';

@Controller('reservation')
@UseGuards(JWTAuthGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  @UseGuards(RolesGuard([Role.ADMIN, Role.USER]))
  async getReservations(@Request() req, @Response() res) {
    const userId = req.user._id;
    const response = await this.reservationService.getReservations(userId);
    return res.status(HttpStatus.OK).json(response);
  }

  @Post(":restaurantId")
  @UseGuards(RolesGuard([Role.ADMIN, Role.USER]))
  async createReservation(
    @Param('restaurantId') restaurantId: string,
    @Body() reservation: CreateReservationDto,
    @Request() req,
    @Response() res,
  ) {
    const userId = req.user._id;
    const restaurantObjectId = new Types.ObjectId(restaurantId);
    const response = await this.reservationService.createReservation({
      ...reservation,
      restaurantId: restaurantObjectId,
      userId,
    });
    return res.status(HttpStatus.CREATED).json(response);
  }
}
