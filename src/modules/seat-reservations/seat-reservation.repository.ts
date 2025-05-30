import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class SeatReservationRepository {
  constructor(private db: DatabaseService) {}

  async findManyByShowtimeAndSeatIds(showtimeId: string, seatIds: string[]) {
    return this.db.seatReservation.findMany({
      where: { showtimeId, seatId: { in: seatIds } },
    });
  }

  async findManyByShowtimeId(showtimeId: string) {
    return this.db.seatReservation.findMany({
      where: { showtimeId },
      select: { seatId: true },
    });
  }
}
