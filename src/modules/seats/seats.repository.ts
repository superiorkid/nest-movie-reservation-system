import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/shared/database/database.service';
import { CreateSeatsDTO, UpdateSeatsDTO } from './seats.dto';

@Injectable()
export class SeatsRepository {
  constructor(private db: DatabaseService) {}

  async findOneById(id: string) {
    return this.db.seat.findUnique({ where: { id } });
  }

  async findOneBySeatNumberAndTheater(seatNumber: string, theaterId: string) {
    return this.db.seat.findFirst({
      where: { AND: [{ seatNumber }, { theaterId }] },
    });
  }

  async findManyByTheater(theaterId: string) {
    return this.db.seat.findMany({ where: { theaterId } });
  }

  async create(createSeatDto: CreateSeatsDTO) {
    const { isActive, seatNumber, theaterId } = createSeatDto;
    return this.db.seat.create({ data: { seatNumber, isActive, theaterId } });
  }

  async createMany(theaterId: string, seatsNumbers: string[]) {
    return this.db.seat.createMany({
      data: seatsNumbers.map((seatNumber) => ({
        seatNumber,
        theaterId,
      })),
    });
  }

  async delete(id: string) {
    return this.db.seat.delete({ where: { id } });
  }

  async deleteManyByTheaterId(theaterId: string) {
    return this.db.seat.deleteMany({ where: { theaterId } });
  }

  update(id: string, updateSeatDto: UpdateSeatsDTO) {
    const { isActive, seatNumber } = updateSeatDto;
    return this.db.seat.update({
      where: { id },
      data: { seatNumber, isActive },
    });
  }

  async findManyByIds(ids: string[]) {
    return this.db.seat.findMany({
      where: { id: { in: ids } },
    });
  }

  async findManyByTheaterAndIsActive(params: {
    theaterId: string;
    isActive: boolean;
  }) {
    const { isActive, theaterId } = params;
    return this.db.seat.findMany({
      where: {
        theaterId,
        isActive: true,
        OR: [
          { isLocked: false },
          { lockedUntil: { lt: new Date() } }, // Include seats with expired locks
        ],
      },
      orderBy: { seatNumber: 'asc' },
    });
  }

  async clearExpiredLocks() {
    await this.db.seat.updateMany({
      where: { AND: [{ isLocked: true }, { lockedUntil: { lt: new Date() } }] },
      data: {
        isLocked: false,
        lockedUntil: null,
      },
    });
  }
}
