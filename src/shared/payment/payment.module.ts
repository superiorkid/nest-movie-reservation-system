import { forwardRef, Module } from '@nestjs/common';
import { ReservationModule } from 'src/modules/reservation/reservation.module';
import { DatabaseModule } from '../database/database.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';

@Module({
  imports: [forwardRef(() => ReservationModule), DatabaseModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
