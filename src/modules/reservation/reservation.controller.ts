import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Response,
  HttpStatus,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { JWTAuthGuard, RolesGuard } from 'src/middlewares/auth.middleware';
import { Role } from 'src/common/enum';
import {
  CreateReservationRequest,
  UpdateReservationRequest,
} from 'src/modules/reservation/dto/request-reservation.dto';
import { Types } from 'mongoose';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Reservation } from 'src/modules/reservation/schema/reservation.schema';

@ApiTags('reservations')
@Controller('reservation')
@UseGuards(JWTAuthGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Get()
  @UseGuards(RolesGuard([Role.ADMIN, Role.USER]))
  @ApiOperation({
    summary: 'Get all reservations',
    description:
      'Allows only admin and user roles to access this endpoint. User can only see their own reservations. Admin can see all reservations.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of reservations',
    type: [Reservation],
  })
  async getReservations(@Request() req, @Response() res) {
    const userId = req.user._id;
    const response = await this.reservationService.getReservations(userId);
    return res.status(HttpStatus.OK).json(response);
  }

  @Post(':restaurantId')
  @UseGuards(RolesGuard([Role.ADMIN, Role.USER]))
  @ApiOperation({
    summary: 'Create a reservation',
    description:
      'Allows only admin and user roles to access this endpoint. User and admin can only create their own reservations.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Reservation created successfully',
    type: Reservation,
  })
  async createReservation(
    @Param('restaurantId') restaurantId: string,
    @Body() reservationBody: CreateReservationRequest,
    @Request() req,
    @Response() res,
  ) {
    const userId = req.user._id;
    const restaurantObjectId = new Types.ObjectId(restaurantId);
    const reservationReq: CreateReservationRequest = {
      ...reservationBody,
      restaurantId: restaurantObjectId,
      userId,
    };
    const isExceedMaxSeats =
      await this.reservationService.checkIsExceedMaxSeats(
        restaurantObjectId,
        reservationBody.startTime,
        reservationBody.endTime,
        reservationBody.seats,
      );
    if (isExceedMaxSeats && req.user.role !== Role.ADMIN) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Exceed max seats' });
    }
    const response =
      await this.reservationService.createReservation(reservationReq);
    return res.status(HttpStatus.CREATED).json(response);
  }

  @Patch(':reservationId')
  @UseGuards(RolesGuard([Role.ADMIN, Role.USER]))
  @ApiOperation({
    summary: 'Update a reservation',
    description:
      'Allows only admin and user roles to access this endpoint. User can only update their own reservations. Admin can update any reservation.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reservation updated successfully',
    type: Reservation,
  })
  async updateReservation(
    @Param('reservationId') reservationId: string,
    @Body() reservation: UpdateReservationRequest,
    @Request() req,
    @Response() res,
  ) {
    const userId = req.user._id;
    const targetReservation =
      await this.reservationService.getReservationById(reservationId);
    if (!targetReservation) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Reservation not found' });
    }
    if (
      targetReservation.userId.toString() !== userId.toString() &&
      req.user.role !== Role.ADMIN
    ) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'You are not allowed to update this reservation' });
    }
    const isExceedMaxSeats =
      await this.reservationService.checkIsExceedMaxSeats(
        targetReservation.restaurantId,
        reservation.startTime || targetReservation.startTime,
        reservation.endTime || targetReservation.endTime,
        reservation.seats || targetReservation.seats,
      );
    if (isExceedMaxSeats && req.user.role !== Role.ADMIN) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Exceed max seats' });
    }
    const response = await this.reservationService.updateReservation(
      reservationId,
      reservation,
    );
    return res.status(HttpStatus.OK).json(response);
  }

  @Delete(':reservationId')
  @UseGuards(RolesGuard([Role.ADMIN, Role.USER]))
  @ApiOperation({
    summary: 'Delete a reservation',
    description:
      'Allows only admin and user roles to access this endpoint. User can only delete their own reservations. Admin can delete any reservation.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Reservation deleted successfully',
  })
  async deleteReservation(
    @Param('reservationId') reservationId: string,
    @Request() req,
    @Response() res,
  ) {
    const userId = req.user._id;
    const targetReservation =
      await this.reservationService.getReservationById(reservationId);
    if (!targetReservation) {
      return res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: 'Reservation not found' });
    }
    if (
      targetReservation.userId.toString() !== userId.toString() &&
      req.user.role !== Role.ADMIN
    ) {
      return res
        .status(HttpStatus.FORBIDDEN)
        .json({ message: 'You are not allowed to delete this reservation' });
    }

    const isOngoing =
      await this.reservationService.isReservationOnGoing(reservationId);
    if (isOngoing && req.user.role !== Role.ADMIN) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ message: 'Cannot delete ongoing reservation' });
    }
    const response =
      await this.reservationService.deleteReservation(reservationId);
    return res.status(HttpStatus.OK).json(response);
  }
}
