import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/database/database.service';
import { CreateGenreDTO, UpdateGenreDTO } from './genres.dto';

@Injectable()
export class GenresRepository {
  constructor(private db: DatabaseService) {}

  async findOneById(id: number) {
    return this.db.genre.findUnique({ where: { id } });
  }

  async findOneByTitle(title: string) {
    return this.db.genre.findUnique({ where: { title } });
  }

  async delete(id: number) {
    return this.db.genre.delete({ where: { id } });
  }

  async findMany() {
    return this.db.genre.findMany({ orderBy: { updatedAt: 'desc' } });
  }

  async create(createGenreDto: CreateGenreDTO) {
    const { title, description } = createGenreDto;
    return this.db.genre.create({ data: { title, description } });
  }

  async update(id: number, updateGenreDto: UpdateGenreDTO) {
    const { title, description } = updateGenreDto;
    return this.db.genre.update({
      where: { id },
      data: { title, description },
    });
  }
}
