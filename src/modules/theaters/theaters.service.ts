import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import generateSeatNumbers from 'src/common/utils/generate-seat-numbers';
import { SeatsRepository } from '../seats/seats.repository';
import { TheatersRepository } from './theaters.repository';
import { CreateTheatersDTO, UpdateTheatersDTO } from './theates.dto';

@Injectable()
export class TheatersService {
  constructor(
    private theaterRepository: TheatersRepository,
    private seatsRepository: SeatsRepository,
  ) {}

  async createTheater(createTheaterDto: CreateTheatersDTO) {
    const { locationId, name } = createTheaterDto;

    const theaterExists = await this.theaterRepository.findOneByNameAndLocation(
      name,
      locationId,
    );
    if (theaterExists)
      throw new ConflictException(
        'theater with name and location already exists',
      );

    try {
      const theater = await this.theaterRepository.create(createTheaterDto);

      // generate seat here
      const seatsNumbers = generateSeatNumbers(
        theater.capacity,
        theater.seatsPerRow,
      );

      await this.seatsRepository.createMany(theater.id, seatsNumbers);

      return {
        success: true,
        message: 'create theater successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('failed to create theater');
    }
  }

  async findAllTheater() {
    try {
      const theaters = await this.theaterRepository.findAll();
      return {
        success: true,
        message: 'theaters retrivied successfully',
        data: theaters,
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('failed to find all theaters');
    }
  }

  async detailTheater(id: string) {
    try {
      const theater = await this.theaterRepository.findOneById(id);
      if (!theater) throw new NotFoundException('theater not found.');
      return {
        success: true,
        message: 'detail theater successfully',
        data: theater,
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('failed to get detail theater.');
    }
  }

  async updateTheater(id: string, updateTheaterDto: UpdateTheatersDTO) {
    const existingTheater = await this.theaterRepository.findOneById(id);
    if (!existingTheater) throw new NotFoundException('theater not found');

    const { name, locationId } = updateTheaterDto;
    if (
      (name && name !== existingTheater.name) ||
      (locationId && locationId !== existingTheater.locationId)
    ) {
      const duplicateTheater =
        await this.theaterRepository.findOneByNameAndLocation(
          name || '',
          locationId || '',
        );

      if (duplicateTheater && duplicateTheater.id !== id) {
        throw new ConflictException(
          'A theater with the same name already exists in the location.',
        );
      }
    }

    try {
      await this.theaterRepository.update(id, updateTheaterDto);
      return {
        success: true,
        message: 'theater updated successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('failed to upate theater.');
    }
  }

  async deleteTheater(id: string) {
    const existingTheater = await this.theaterRepository.findOneById(id);
    if (!existingTheater) throw new NotFoundException('theater not found');

    try {
      await this.theaterRepository.delete(id);
      return {
        success: true,
        message: 'delete theater successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('failed to upate theater.');
    }
  }
}
