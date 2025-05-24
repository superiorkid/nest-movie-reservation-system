import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSeatsDTO, SeatFilter, UpdateSeatsDTO } from './seats.dto';
import { SeatsRepository } from './seats.repository';

@Injectable()
export class SeatsService {
  constructor(private seatRepository: SeatsRepository) {}

  async findAllSeatByTheater(filter: SeatFilter) {
    try {
      const seats = await this.seatRepository.findManyByTheater(
        filter.theaterId,
      );
      return {
        success: true,
        message: 'seats retrivied successfully',
        data: seats,
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Failed to find seats');
    }
  }

  async createSeat(createSeatDto: CreateSeatsDTO) {
    const { isActive, seatNumber, theaterId } = createSeatDto;

    const seatExist = await this.seatRepository.findOneBySeatNumberAndTheater(
      seatNumber,
      theaterId,
    );
    if (seatExist)
      throw new ConflictException(
        'seat already exist with this number and theater id',
      );

    try {
      await this.seatRepository.create(createSeatDto);
      return {
        success: true,
        message: 'create seat successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('failed to create seat');
    }
  }

  async detailSeat(id: string) {
    try {
      const seat = await this.seatRepository.findOneById(id);
      if (!seat) throw new NotFoundException('Seat not found');
      return {
        success: true,
        message: 'get seat successfully',
        data: seat,
      };
    } catch (error) {
      console.error(error.message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('failed to create seat');
    }
  }

  async updateSeat(id: string, updateSeatDto: UpdateSeatsDTO) {
    const seat = await this.seatRepository.findOneById(id);
    if (!seat) throw new NotFoundException('Seat not found.');

    try {
      await this.seatRepository.update(id, updateSeatDto);
      return {
        success: true,
        message: 'Update seat successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('failed to create seat');
    }
  }

  async deleteSeat(id: string) {
    const seat = await this.seatRepository.findOneById(id);
    if (!seat) throw new NotFoundException('Seat not found.');

    try {
      await this.seatRepository.delete(id);
      return {
        success: true,
        message: 'Delete seat successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('failed to create seat');
    }
  }
}
