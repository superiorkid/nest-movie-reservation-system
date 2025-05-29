import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { ReservationController } from './reservation.controller';
import { ReservationReposity } from './reservation.repository';
import { ReservationService } from './reservation.service';
import { ShowtimesModule } from '../showtimes/showtimes.module';
import { SeatReservationModule } from '../seat-reservations/seat-reservation.module';
import { SeatModule } from '../seats/seats.module';

@Module({
  imports: [DatabaseModule, ShowtimesModule, SeatReservationModule, SeatModule],
  controllers: [ReservationController],
  providers: [ReservationReposity, ReservationService],
  exports: [ReservationReposity],
})
export class ReservationModule {}
