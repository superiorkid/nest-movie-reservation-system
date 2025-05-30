import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { ReservationModule } from 'src/modules/reservation/reservation.module';

@Module({
  imports: [DatabaseModule, ReservationModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
