import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateReservationDTO, GetAvailableSeatsDTO } from './reservation.dto';
import { ReservationService } from './reservation.service';

@Controller('reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Get('available-seats')
  async getAvailableSeats(@Query() getAvailableSeatsDto: GetAvailableSeatsDTO) {
    return this.reservationService.getAvailableSeats(getAvailableSeatsDto);
  }

  @Post()
  @FormDataRequest()
  async create(
    @Req() req: Request,
    @Body() createReservationDto: CreateReservationDTO,
  ) {
    const userId = req.user?.['sub'];
    return this.reservationService.createReservation({
      ...createReservationDto,
      userId,
    });
  }
}
