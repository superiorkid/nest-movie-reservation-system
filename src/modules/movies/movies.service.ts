import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { FileUploadService } from 'src/shared/file-upload/file-upload.service';
import { CreateMovieDTO, UpdateMovieDTO } from './movies.dto';
import { MoviesRepository } from './movies.repository';

@Injectable()
export class MoviesService {
  constructor(
    private moviesRepository: MoviesRepository,
    private fileUploadService: FileUploadService,
  ) {}

  async create(createMovieDto: CreateMovieDTO) {
    const {
      title,
      description,
      status,
      releaseDate,
      durationMinutes,
      language,
      genres,
      poster,
    } = createMovieDto;

    const movieExists = await this.moviesRepository.findOneByTitle(title);
    if (movieExists) throw new ConflictException('Movie aleady exists');

    try {
      // save poster to local storage
      const fileName = await this.fileUploadService.upload(poster);

      await this.moviesRepository.create({
        title,
        description,
        genres,
        durationMinutes,
        language,
        status,
        releaseDate,
        poster: fileName,
      });

      return {
        success: true,
        message: 'Create movie successfully.',
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Failed to create movie.');
    }
  }

  async delete(id: string) {
    const movie = await this.moviesRepository.findOneById(id);
    if (!movie) throw new NotFoundException('Movie not found.');
    try {
      const deletedMovie = await this.moviesRepository.delete(id);
      if (deletedMovie.posterUrl) {
        await this.fileUploadService.delete(deletedMovie.posterUrl);
      }

      return {
        success: true,
        message: 'Movie deleted successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Failed to delete movie.');
    }
  }

  async update(id: string, updateMovieDto: UpdateMovieDTO) {
    const movie = await this.moviesRepository.findOneById(id);
    if (!movie) throw new NotFoundException('Movie not found.');

    let newUploadFile: string | undefined;
    if (updateMovieDto.poster) {
      // remove old poster
      await this.fileUploadService.delete(movie.posterUrl);
      newUploadFile = await this.fileUploadService.upload(
        updateMovieDto.poster,
      );
    }

    try {
      const { poster, ...rest } = updateMovieDto;
      await this.moviesRepository.update({
        id,
        updateMovieDto: { ...rest, posterUrl: newUploadFile },
      });

      return {
        success: true,
        message: 'Update movie successfully',
      };
    } catch (error) {
      console.log(error.message);
      throw new InternalServerErrorException('Failed to update the movie.');
    }
  }

  async findMany() {
    try {
      const movies = await this.moviesRepository.findMany();
      return {
        success: true,
        message: 'Get movies successfully',
        data: movies,
      };
    } catch (error) {
      console.error('');
      throw new InternalServerErrorException('failed to get movies');
    }
  }

  async movieDetail(id: string) {
    try {
      const movie = await this.moviesRepository.findOneById(id);
      if (!movie) throw new NotFoundException('movie not found.');
      return {
        success: true,
        message: 'Get detail movie successfully',
        data: movie,
      };
    } catch (error) {
      console.error(error.message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to get detail movie.');
    }
  }
}
