import { Module } from '@nestjs/common';
import { ReservationModule } from '../reservation/reservation.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { ShowtimesModule } from '../showtimes/showtimes.module';

@Module({
  imports: [ReservationModule, ShowtimesModule],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
