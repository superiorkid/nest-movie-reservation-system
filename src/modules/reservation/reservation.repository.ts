import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/database/database.service';

@Injectable()
export class ReservationReposity {
  constructor(private db: DatabaseService) {}

  async create(data: {
    userId: string;
    showtimeId: string;
    seatIds: string[];
    totalPrice: number;
  }) {
    return this.db.reservation.create({
      data: {
        userId: data.userId,
        showtimeId: data.showtimeId,
        totalPrice: data.totalPrice,
        seatReservations: {
          create: data.seatIds.map((seatId) => ({
            seat: { connect: { id: seatId } },
            showtime: { connect: { id: data.showtimeId } },
          })),
        },
      },
    });
  }

  async findMany() {}

  async findOne() {}

  async update() {}
}
