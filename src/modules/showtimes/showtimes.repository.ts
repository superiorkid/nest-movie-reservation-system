import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/database/database.service';
import { CreateShowtimeDTO, UpdateShowtimeDTO } from './showtimes.dto';

@Injectable()
export class ShowtimesRepository {
  constructor(private db: DatabaseService) {}

  async findOneById(id: string) {
    return this.db.showtime.findUnique({
      where: { id },
      include: { movie: true, theater: true },
    });
  }

  async findManyByMovieId(movieId: string) {
    return this.db.showtime.findMany({ where: { movieId } });
  }

  async create(createShowtimeDto: CreateShowtimeDTO) {
    const { movieId, startTime, endTime, price, status, theaterId } =
      createShowtimeDto;
    return this.db.showtime.create({
      data: {
        movieId,
        startTime,
        endTime,
        theaterId,
        price,
        status,
      },
    });
  }

  async update(id: string, updateShowtimeDTO: UpdateShowtimeDTO) {
    const { endTime, movieId, startTime, price, status, theaterId } =
      updateShowtimeDTO;
    return this.db.showtime.update({
      where: { id },
      data: { movieId, startTime, endTime, price, status, theaterId },
    });
  }

  async delete(id: string) {
    return this.db.showtime.delete({ where: { id } });
  }

  async findMany() {
    return this.db.showtime.findMany({
      include: {
        movie: true,
        theater: true,
        seatReservations: true,
        reservations: {
          where: {
            status: 'CONFIRMED',
          },
        },
      },
    });
  }
}
