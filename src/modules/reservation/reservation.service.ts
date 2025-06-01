import {
  ConflictException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ReservationStatus, ShowtimeStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { DatabaseService } from 'src/shared/database/database.service';
import { TypedEventEmitter } from 'src/shared/event-emitter/typed-event-emitter.class';
import { PaymentService } from 'src/shared/payment/payment.service';
import { SeatReservationRepository } from '../seat-reservations/seat-reservation.repository';
import { SeatsRepository } from '../seats/seats.repository';
import { ShowtimesRepository } from '../showtimes/showtimes.repository';
import { GetAvailableSeatsDTO } from './reservation.dto';
import { ReservationReposity } from './reservation.repository';

@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);
  private readonly SEAT_LOCK_DURATION_MS = 15 * 60 * 1000; //15 min

  constructor(
    private db: DatabaseService,
    @Inject(forwardRef(() => PaymentService))
    private stripe: PaymentService,
    private seatRepository: SeatsRepository,
    private eventEmitter: TypedEventEmitter,
    private showtimeRepository: ShowtimesRepository,
    private reservationRepository: ReservationReposity,
    private seatReservationRepository: SeatReservationRepository,
  ) {}

  async getAvailableSeats({ showtimeId }: GetAvailableSeatsDTO) {
    await this.seatRepository.clearExpiredLocks();

    const showtime = await this.showtimeRepository.findOneById(showtimeId);
    if (!showtime) throw new NotFoundException('showtime not found.');

    if (showtime.status !== ShowtimeStatus.SCHEDULED)
      throw new ConflictException(
        'this showtime not available for reservations',
      );

    const allSeats = await this.seatRepository.findManyByTheaterAndIsActive({
      isActive: true,
      theaterId: showtime.theaterId,
    });

    const reservedSeats =
      await this.seatReservationRepository.findManyByShowtimeId(showtimeId);
    const reservedSeatIds = new Set(reservedSeats.map((rs) => rs.seatId));

    // map available seats
    const availableSeats = allSeats.map((seat) => ({
      id: seat.id,
      seatNumber: seat.seatNumber,
      price: seat.seatPrice.toNumber(),
      isAvailable: !reservedSeatIds.has(seat.id),
    }));

    return {
      success: true,
      message: 'get available seats successfully',
      data: {
        showtimeId,
        theaterName: showtime.theater.name,
        totalSeats: allSeats.length,
        availableSeats: availableSeats.filter((s) => s.isAvailable),
        reservedSeats: availableSeats.filter((s) => !s.isAvailable),
        theaterLayout: {
          rows: Math.ceil(allSeats.length / showtime.theater.seatsPerRow),
          seatsPerRow: showtime.theater.seatsPerRow,
        },
      },
    };
  }

  async createReservation(data: {
    userId: string;
    showtimeId: string;
    seatIds: string[];
  }) {
    const { seatIds, showtimeId, userId } = data;

    return this.db.$transaction(async (tx) => {
      await this.seatRepository.clearExpiredLocks();

      const showtime = await tx.showtime.findUnique({
        where: { id: showtimeId },
        include: { movie: true, theater: true },
      });

      if (!showtime) throw new NotFoundException('Showtime not found');
      if (showtime.status !== ShowtimeStatus.SCHEDULED) {
        throw new ConflictException('Showtime not available for reservations');
      }

      // 3. Lock seats with additional validation
      const lockExpiry = new Date(Date.now() + this.SEAT_LOCK_DURATION_MS);
      const seatsToLock = await tx.seat.findMany({
        where: {
          id: { in: seatIds },
          theaterId: showtime.theaterId,
          isActive: true,
        },
        include: {
          seatReservations: {
            where: { showtimeId },
          },
        },
      });

      // Validate all seats exist and are available
      if (seatsToLock.length !== seatIds.length) {
        throw new NotFoundException(
          'One or more seats not found in this theater',
        );
      }

      const unavailableSeats = seatsToLock.filter((seat) => {
        const isCurrentlyLocked =
          seat.isLocked &&
          (seat.lockedUntil === null || seat.lockedUntil > new Date());
        return isCurrentlyLocked || seat.seatReservations.length > 0;
      });
      if (unavailableSeats.length > 0) {
        throw new ConflictException(
          `Seats ${unavailableSeats.map((s) => s.seatNumber).join(', ')} are unavailable`,
        );
      }

      await tx.seat.updateMany({
        where: { id: { in: seatIds } },
        data: { isLocked: true, lockedUntil: lockExpiry },
      });

      // Calculate price
      const totalPrice = seatsToLock.reduce(
        (sum, seat) => sum.add(seat.seatPrice).add(showtime.price),
        new Decimal(0),
      );

      // Create payment intent
      const paymentIntent = await this.stripe.createPaymentIntent(
        totalPrice.toNumber(),
        'usd',
        {
          userId,
          showtimeId,
          movieTitle: showtime.movie.title,
          seatIds: seatIds.join(','),
          reservationExpiry: lockExpiry.toISOString(),
        },
      );

      // Create reservation
      const reservation = await tx.reservation.create({
        data: {
          userId,
          showtimeId,
          totalPrice,
          status: ReservationStatus.PENDING,
          paymentIntentId: paymentIntent.id,
          seatReservations: {
            createMany: {
              data: seatIds.map((seatId) => ({ seatId, showtimeId })),
            },
          },
        },
        include: {
          seatReservations: { include: { seat: true } },
          showtime: { include: { movie: true, theater: true } },
        },
      });

      return {
        success: true,
        message: 'Reservation created successfully',
        data: {
          reservationId: reservation.id,
          paymentIntentId: paymentIntent.id,
          clientSecret: paymentIntent.client_secret,
          expiresAt: lockExpiry,
          seats: reservation.seatReservations.map((sr) => ({
            id: sr.seat.id,
            number: sr.seat.seatNumber,
            price: sr.seat.seatPrice.toNumber(),
          })),
          totalPrice: totalPrice.toNumber(),
        },
      };
    });
  }

  async handlePaymentSuccess(paymentIntentId: string) {
    return this.db.$transaction(async (tx) => {
      const reservation = await tx.reservation.update({
        where: { paymentIntentId },
        data: {
          status: 'CONFIRMED',
          paidAt: new Date(),
        },
        include: {
          user: true,
          showtime: { include: { movie: true, theater: true } },
          seatReservations: { include: { seat: true } },
        },
      });

      this.eventEmitter.emit('payment.success', {
        user: reservation.user,
        showtime: reservation.showtime,
        seatReservations: reservation.seatReservations,
      });

      return reservation;
    });
  }

  async handlePaymentFailed(paymentIntentId: string) {
    return this.db.$transaction(async (tx) => {
      const reservation = await tx.reservation.update({
        where: { paymentIntentId },
        data: { status: 'CANCELLED' },
        include: { user: true },
      });

      this.eventEmitter.emit('payment.cancelled', {
        email: reservation.user.email,
        name: reservation.user.username,
      });

      return reservation;
    });
  }

  async cancelReservation(params: { userId: string; reservationId: string }) {
    const { reservationId, userId } = params;
    const reservation =
      await this.reservationRepository.findOneById(reservationId);

    if (!reservation) throw new NotFoundException('Reservation not found.');
    if (reservation.userId !== userId)
      throw new ForbiddenException('Not your reservation');

    const isUpcoming = reservation.showtime.startTime > new Date();
    if (!isUpcoming)
      throw new ConflictException('Cannot cancel past reservation.');

    if (
      reservation.status === 'CANCELLED' ||
      reservation.status === 'CONFIRMED'
    ) {
      throw new ConflictException('Reservation already cancelled or completed');
    }

    if (reservation.paymentIntentId) {
      try {
        await this.stripe.cancelPayment(reservation.paymentIntentId);
        this.logger.log(
          `PaymentIntent ${reservation.paymentIntentId} cancelled.`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to cancel payment ${reservation.paymentIntentId}.`,
          error.stack,
        );
      }
    }

    try {
      await Promise.all([
        // mark reservation as cancelled
        this.db.reservation.update({
          where: { id: reservationId },
          data: { status: ReservationStatus.CANCELLED },
        }),
        // release seats
        this.db.seat.updateMany({
          where: {
            seatReservations: {
              some: {
                reservationId,
              },
            },
          },
          data: {
            isLocked: false,
            lockedUntil: null,
          },
        }),
        // delete seat reservations
        this.db.seatReservation.deleteMany({ where: { reservationId } }),
      ]);

      return {
        success: true,
        message: 'Reservation cancelled successfully',
      };
    } catch (error) {
      this.logger.log(error.stack);
      throw new InternalServerErrorException(error.message);
    }
  }
}
