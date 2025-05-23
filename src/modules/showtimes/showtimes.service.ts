import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { MoviesRepository } from '../movies/movies.repository';
import { CreateShowtimeDTO, UpdateShowtimeDTO } from './showtimes.dto';
import { ShowtimesRepository } from './showtimes.repository';

@Injectable()
export class ShowtimesService {
  constructor(
    private showtimeRepository: ShowtimesRepository,
    private movieRepository: MoviesRepository,
  ) {}

  async findShowtimesByMovieId(movieId: string) {
    try {
      const showtimes =
        await this.showtimeRepository.findManyByMovieId(movieId);
      return {
        success: true,
        message: 'Movie showtimes retrivied successfully.',
        data: showtimes,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to get movie showtimes.');
    }
  }

  async createShowtime(createShowtimeDto: CreateShowtimeDTO) {
    const movieExists = await this.movieRepository.findOneById(
      createShowtimeDto.movieId,
    );
    if (!movieExists) throw new NotFoundException('Movie not found.');

    try {
      await this.showtimeRepository.create(createShowtimeDto);
      return {
        success: true,
        message: 'create showtime successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create showtime.');
    }
  }

  async detailShowtime(id: string) {
    try {
      const showtime = await this.showtimeRepository.findOneById(id);
      if (!showtime) throw new NotFoundException('Showtime not found.');
      return {
        success: true,
        message: 'Detail showtime retrivied successfully',
        data: showtime,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(
        'failed to get detail movie showtime',
      );
    }
  }

  async updateShowtime(id: string, updateShowtimeDto: UpdateShowtimeDTO) {
    const showtime = await this.showtimeRepository.findOneById(id);
    if (!showtime) throw new NotFoundException('Showtime not found');

    try {
      await this.showtimeRepository.update(id, updateShowtimeDto);
      return {
        success: true,
        message: 'Update showtime successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('failed to update showtime');
    }
  }

  async deleteShowtime(id: string) {
    const showtime = await this.showtimeRepository.findOneById(id);
    if (!showtime) throw new NotFoundException('Showtime not found.');

    try {
      await this.showtimeRepository.delete(id);
      return {
        success: true,
        message: 'Delete showtime successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('failed to delete showtime');
    }
  }
}
