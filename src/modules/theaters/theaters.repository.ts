import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/database/database.service';
import { CreateTheatersDTO, UpdateTheatersDTO } from './theates.dto';

@Injectable()
export class TheatersRepository {
  constructor(private db: DatabaseService) {}

  async create(createTheaterDto: CreateTheatersDTO) {
    const { capacity, locationId, name } = createTheaterDto;
    return this.db.theater.create({ data: { name, capacity, locationId } });
  }

  async findAll() {
    return this.db.theater.findMany({
      include: { location: true, showtimes: true },
    });
  }

  async update(id: string, updateTheaterDto: UpdateTheatersDTO) {
    const { name, locationId, capacity } = updateTheaterDto;
    return this.db.theater.update({
      where: { id },
      data: { name, locationId, capacity },
    });
  }

  async delete(id: string) {
    return this.db.theater.delete({ where: { id } });
  }

  async findOneById(id: string) {
    return this.db.theater.findUnique({
      where: { id },
      include: { location: true, showtimes: true },
    });
  }

  async findOneByName(name: string) {
    return this.db.theater.findFirst({
      where: { name },
      include: { location: true },
    });
  }

  async findManyByLocationId(locationId: string) {
    return this.db.theater.findMany({ where: { locationId } });
  }

  async findOneByNameAndLocation(name: string, locationId: string) {
    return this.db.theater.findFirst({
      where: { AND: [{ name }, { locationId }] },
    });
  }
}
