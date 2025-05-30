import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { PaymentModule } from 'src/shared/payment/payment.module';
import { SeatReservationModule } from '../seat-reservations/seat-reservation.module';
import { SeatModule } from '../seats/seats.module';
import { ShowtimesModule } from '../showtimes/showtimes.module';
import { ReservationController } from './reservation.controller';
import { ReservationReposity } from './reservation.repository';
import { ReservationService } from './reservation.service';

@Module({
  imports: [
    forwardRef(() => PaymentModule),
    DatabaseModule,
    ShowtimesModule,
    SeatReservationModule,
    SeatModule,
  ],
  controllers: [ReservationController],
  providers: [ReservationReposity, ReservationService],
  exports: [ReservationReposity, ReservationService],
})
export class ReservationModule {}
