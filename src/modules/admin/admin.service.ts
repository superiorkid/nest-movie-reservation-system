import { Injectable } from '@nestjs/common';
import { ReservationReposity } from '../reservation/reservation.repository';
import { ShowtimesRepository } from '../showtimes/showtimes.repository';

@Injectable()
export class AdminService {
  constructor(
    private reservationRepository: ReservationReposity,
    private showtimeRepository: ShowtimesRepository,
  ) {}

  async adminGetReservations() {
    const [reservations, showtimeStats] = await Promise.all([
      // get all reservations
      this.reservationRepository.findMany(),
      // aggregate capacity and revenue by showtime
      this.showtimeRepository.findMany(),
    ]);

    const showtimeData = showtimeStats.map((showtime) => {
      const reservedStats = showtime.seatReservations.length;
      const revenue = showtime.reservations.reduce(
        (sum, r) => sum + r.totalPrice.toNumber(),
        0,
      );

      return {
        showtimeId: showtime.id,
        movieTitle: showtime.movie.title,
        theaterName: showtime.theater.name,
        startTime: showtime.startTime,
        capacity: showtime.theater.capacity,
        reservedStats,
        revenue,
      };
    });

    return {
      success: true,
      message: 'get admin reservations successfully',
      data: {
        reservations: reservations.map((r) => ({
          id: r.id,
          user: r.user,
          showtime: {
            id: r.showtime.id,
            movieTitle: r.showtime.movie.title,
            theaterName: r.showtime.theater.name,
            startTime: r.showtime.startTime,
          },
          status: r.status,
          totalPrice: r.totalPrice.toNumber(),
          seats: r.seatReservations.map((sr) => ({
            id: sr.seat.id,
            number: sr.seat.seatNumber,
            price: sr.seat.seatPrice.toNumber(),
          })),
          createdAt: r.createdAt,
        })),
        showtimeStats: showtimeData,
      },
    };
  }
}
