import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Response, HttpStatus } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { JWTAuthGuard, RolesGuard } from 'src/middlewares/auth.middleware';
import { Role } from 'src/common/enum';
import { CreateReservationRequest, UpdateReservationRequest } from 'src/modules/reservation/dto/request-reservation.dto';
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
    @Body() reservation: CreateReservationRequest,
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

  @Patch(":reservationId")
  @UseGuards(RolesGuard([Role.ADMIN, Role.USER]))
  async updateReservation(
    @Param('reservationId') reservationId: string,
    @Body() reservation: UpdateReservationRequest,
    @Request() req,
    @Response() res,
  ) {
    const userId = req.user._id;
    const targetReservation = await this.reservationService.getReservationById(reservationId);
    if (!targetReservation) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Reservation not found' });
    }
    if ((targetReservation.userId.toString() !== userId.toString() && req.user.role !== Role.ADMIN)) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'You are not allowed to update this reservation' });
    }
    const response = await this.reservationService.updateReservation(reservationId, {
      ...reservation,
      userId,
    });
    return res.status(HttpStatus.OK).json(response);
  }

  @Delete(":reservationId")
  @UseGuards(RolesGuard([Role.ADMIN, Role.USER]))
  async deleteReservation(
    @Param('reservationId') reservationId: string,
    @Request() req,
    @Response() res,
  ) {
    const userId = req.user._id;
    const targetReservation = await this.reservationService.getReservationById(reservationId);
    if (!targetReservation) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'Reservation not found' });
    }
    if ((targetReservation.userId.toString() !== userId.toString() && req.user.role !== Role.ADMIN)) {
      return res.status(HttpStatus.FORBIDDEN).json({ message: 'You are not allowed to delete this reservation' });
    }
    const response = await this.reservationService.deleteReservation(reservationId);
    return res.status(HttpStatus.OK).json(response);
  }

}
