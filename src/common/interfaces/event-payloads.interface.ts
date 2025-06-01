import { Prisma, User } from '@prisma/client';

export interface EventPayloads {
  'payment.success': {
    user: User;
    showtime: Prisma.ShowtimeGetPayload<{
      include: { movie: true; theater: true };
    }>;
    seatReservations: Prisma.SeatReservationGetPayload<{
      include: { seat: true };
    }>[];
  };
  'payment.cancelled': { name: string; email: string };
}
