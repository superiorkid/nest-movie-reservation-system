import { Injectable } from '@nestjs/common';
import { ReservationStatus } from '@prisma/client';
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

  async confirmReservationByPaymentIntent(paymentIntentId: string) {
    return this.db.reservation.update({
      where: { paymentIntentId },
      data: {
        status: ReservationStatus.CONFIRMED,
        paidAt: new Date(),
      },
    });
  }

  async getReservationWithDetails(id: string) {
    return this.db.reservation.findUnique({
      where: { id },
      include: {
        user: { select: { email: true } },
        showtime: {
          include: {
            movie: { select: { title: true } },
            theater: { select: { name: true } },
          },
        },
        seatReservations: {
          include: { seat: { select: { seatNumber: true, seatPrice: true } } },
        },
      },
    });
  }

  async findManyReservationByUserId(params: {
    userId: string;
    isUpcoming: boolean;
  }) {
    const { isUpcoming, userId } = params;
    return this.db.reservation.findMany({
      where: isUpcoming
        ? { AND: [{ userId }, { showtime: { startTime: { gt: new Date() } } }] }
        : { userId },
      include: {
        showtime: { include: { movie: true, theater: true } },
        seatReservations: { include: { seat: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
