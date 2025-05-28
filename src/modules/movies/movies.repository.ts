import { Injectable } from '@nestjs/common';
import { MovieStatus } from '@prisma/client';
import { DatabaseService } from 'src/shared/database/database.service';
import { QueryFilters, SaveToDB, UpdateSaveToDB } from './movies.dto';

@Injectable()
export class MoviesRepository {
  constructor(private db: DatabaseService) {}

  async findOneById(id: string) {
    return this.db.movie.findUnique({
      where: { id },
      include: { genres: { include: { genre: true } } },
    });
  }

  async findOneByTitle(title: string) {
    return this.db.movie.findFirst({ where: { title } });
  }

  async findByManyStatus(status: MovieStatus) {
    return this.db.movie.findMany({
      where: { status },
      orderBy: { releaseDate: 'desc' },
    });
  }

  async create(createMovieDto: SaveToDB) {
    const {
      durationMinutes,
      genres,
      language,
      poster,
      releaseDate,
      status,
      title,
      description,
    } = createMovieDto;
    return this.db.movie.create({
      data: {
        title,
        description,
        status,
        releaseDate,
        durationMinutes,
        posterUrl: poster,
        language,
        genres: {
          create: genres.map((genreId) => ({
            genre: {
              connect: {
                id: genreId,
              },
            },
          })),
        },
      },
    });
  }

  async delete(id: string) {
    return this.db.movie.delete({ where: { id } });
  }

  async update(params: { id: string; updateMovieDto: UpdateSaveToDB }) {
    const { id, updateMovieDto } = params;
    const { genres, ...rest } = updateMovieDto;
    const dataToUpdate: any = { ...rest };
    if (genres && Array.isArray(genres)) {
      dataToUpdate.genres = {
        deleteMany: {},
        create: genres.map((genreId) => ({
          genre: { connect: { id: genreId } },
        })),
      };
    }
    return this.db.movie.update({ where: { id }, data: dataToUpdate });
  }

  async findMany(filters: QueryFilters) {
    const { date } = filters;
    const dateObject = date ? new Date(date) : null;
    return this.db.movie.findMany({
      where: dateObject
        ? {
            showtimes: {
              some: {
                startTime: {
                  gte: new Date(dateObject.setHours(0, 0, 0, 0)),
                  lt: new Date(dateObject.setHours(23, 59, 59, 999)),
                },
              },
            },
          }
        : undefined,
      include: {
        genres: { include: { genre: true } },
      },
    });
    // return this.db.movie.findMany({
    //   orderBy: { releaseDate: 'desc' },
    //   include: { genres: { include: { genre: true } } },
    // });
  }

  async findOne(id: string) {
    return this.db.movie.findUnique({
      where: { id },
      include: { genres: true },
    });
  }
}
