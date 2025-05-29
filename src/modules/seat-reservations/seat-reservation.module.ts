import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { SeatReservationRepository } from './seat-reservation.repository';

@Module({
  imports: [DatabaseModule],
  providers: [SeatReservationRepository],
  exports: [SeatReservationRepository],
})
export class SeatReservationModule {}
