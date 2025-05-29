import { Injectable } from '@nestjs/common';
import { SeatReservationRepository } from '../seat-reservations/seat-reservation.repository';
import { SeatsRepository } from '../seats/seats.repository';
import { ShowtimesRepository } from '../showtimes/showtimes.repository';
import { ReservationReposity } from './reservation.repository';

@Injectable()
export class ReservationService {
  constructor(
    private reservationRepository: ReservationReposity,
    private showtimeRepository: ShowtimesRepository,
    private seatReservationRepository: SeatReservationRepository,
    private seatRepository: SeatsRepository,
  ) {}

  // async createReservation(data: {
  //   userId: string;
  //   showtimeId: string;
  //   seatIds: string[];
  //   totalPrice: number;
  // }) {
  //   const { seatIds, showtimeId, totalPrice, userId } = data;

  //   const showtime = await this.showtimeRepository.findOneById(showtimeId);
  //   if (!showtime) throw new NotFoundException('Showtime not found.');

  //   const existingReservations =
  //     await this.seatReservationRepository.findManyByShowtimeAndSeatIds(
  //       showtimeId,
  //       seatIds,
  //     );
  //   if (existingReservations.length > 0) {
  //     const alreadyReservedSeatIds = existingReservations.map((r) => r.seatId);
  //     throw new BadRequestException(
  //       `Seats already reserved: ${alreadyReservedSeatIds.join(', ')}`,
  //     );
  //   }

  //   const seats = await this.seatRepository.findManyByIds(seatIds);
  //   if (seats.length !== seatIds.length)
  //     throw new BadRequestException('One more seat IDs are invalid');

  //   const expectedTotalPrice = showtime.price.toNumber() * seatIds.length;
  //   if (expectedTotalPrice)
  //     throw new BadRequestException(
  //       `Total price missmatch. Expected ${expectedTotalPrice}, got ${totalPrice}`,
  //     );

  //   const calculatedTotal = seats.reduce(
  //     (sum, seat) => sum + seat.seatPrice.toNumber(),
  //     0,
  //   );
  //   if (calculatedTotal !== totalPrice) {
  //     throw new BadRequestException(
  //       `Total price mismatch. Expected ${calculatedTotal}, got ${totalPrice}`,
  //     );
  //   }

  //   await this.reservationRepository.create({
  //     seatIds,
  //     showtimeId,
  //     totalPrice,
  //     userId,
  //   });

  //   return {
  //     success: true,
  //   };
  // }
}
