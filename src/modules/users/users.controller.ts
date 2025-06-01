import { Controller, Get, Query, Req } from '@nestjs/common';
import { Request } from 'express';
import { ReservationParamsDTO } from './users.dto';
import { UserService } from './users.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  async me(@Req() req: Request) {
    const userId = req.user?.['sub'];
    return this.userService.getSession(userId);
  }

  @Get('me/reservations')
  async getUserReservations(
    @Req() req: Request,
    @Query() query: ReservationParamsDTO,
  ) {
    const userId = req.user?.['sub'];
    const isUpcoming = query.upcoming;
    return this.userService.getUserReservations({ isUpcoming, userId });
  }
}
