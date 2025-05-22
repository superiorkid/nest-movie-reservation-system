import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateGenreDTO, UpdateGenreDTO } from './genres.dto';
import { GenresRepository } from './genres.repository';

@Injectable()
export class GenresService {
  constructor(private genreRepository: GenresRepository) {}

  async findGenres() {
    try {
      const genres = await this.genreRepository.findMany();
      return {
        success: true,
        message: 'Genres retrivied successfully',
        data: genres,
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('');
    }
  }

  async createGenre(createGenreDto: CreateGenreDTO) {
    const genreExists = await this.genreRepository.findOneByTitle(
      createGenreDto.title,
    );
    if (genreExists) throw new ConflictException('Genre already exists');

    try {
      await this.genreRepository.create(createGenreDto);
      return {
        success: true,
        message: 'Create genre successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to ');
    }
  }

  async detailGenre(id: number) {
    try {
      const genre = await this.genreRepository.findOneById(id);
      if (!genre) throw new NotFoundException('Genre not found.');
      return {
        success: true,
        message: 'Get detail genre successfully',
        data: genre,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to get detail genre');
    }
  }

  async updateGenre(id: number, updateGenreDto: UpdateGenreDTO) {
    const genreExists = await this.genreRepository.findOneById(id);
    if (!genreExists) throw new NotFoundException('Genre not found.');

    try {
      await this.genreRepository.update(id, updateGenreDto);
      return {
        success: true,
        message: 'Update genre successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Failed to update genre');
    }
  }

  async deleteGenre(id: number) {
    const genreExists = await this.genreRepository.findOneById(id);
    if (!genreExists) throw new NotFoundException('Genre not found.');

    try {
      await this.genreRepository.delete(id);
      return {
        success: true,
        message: 'Delete genre successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Failed to delete genre');
    }
  }
}
