import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/database/database.service';
import { CreateLocationDTO, UpdateLocationDTO } from './locations.dto';

@Injectable()
export class LocationsRepository {
  constructor(private db: DatabaseService) {}

  async create(createLocationDto: CreateLocationDTO) {
    const { address, city } = createLocationDto;
    return this.db.location.create({ data: { city, address } });
  }

  async findAll() {
    return this.db.location.findMany();
  }

  async findOneById(id: string) {
    return this.db.location.findUnique({ where: { id } });
  }

  async update(id: string, updateLocationDto: UpdateLocationDTO) {
    const { address, city } = updateLocationDto;
    return this.db.location.update({ where: { id }, data: { city, address } });
  }

  async delete(id: string) {
    return this.db.location.delete({ where: { id } });
  }

  async findOneByCityAndAddress(city: string, address: string) {
    return this.db.location.findFirst({
      where: { AND: [{ city }, { address }] },
    });
  }
}
