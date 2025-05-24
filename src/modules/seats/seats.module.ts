import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { SeatsController } from './seats.controller';
import { SeatsRepository } from './seats.repository';
import { SeatsService } from './seats.service';

@Module({
  imports: [DatabaseModule],
  controllers: [SeatsController],
  providers: [SeatsRepository, SeatsService],
  exports: [SeatsRepository],
})
export class SeatModule {
  constructor() {}
}
