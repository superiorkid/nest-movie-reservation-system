import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateLocationDTO, UpdateLocationDTO } from './locations.dto';
import { LocationsRepository } from './locations.repositry';

@Injectable()
export class LocationService {
  constructor(private locationRepository: LocationsRepository) {}

  async createLocation(createLocationDto: CreateLocationDTO) {
    const { address, city } = createLocationDto;

    const locationExists =
      await this.locationRepository.findOneByCityAndAddress(city, address);
    if (locationExists)
      throw new ConflictException(
        'Location with the same city address aldreay exists.',
      );

    try {
      await this.locationRepository.create(createLocationDto);
      return {
        success: true,
        message: 'create location successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Failed to create location.');
    }
  }

  async allLocations() {
    try {
      const locations = await this.locationRepository.findAll();
      return {
        success: true,
        message: 'Locations retrivied successully',
        data: locations,
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('failed to get all location.');
    }
  }

  async detailLocation(id: string) {
    try {
      const location = await this.locationRepository.findOneById(id);
      if (!location) throw new NotFoundException('Location not found.');
      return {
        success: true,
        message: 'location retrivied successfully',
        data: location,
      };
    } catch (error) {
      console.error(error.message);
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Failed to get location detail');
    }
  }

  async updateLocation(id: string, updateLocationDto: UpdateLocationDTO) {
    const location = await this.locationRepository.findOneById(id);
    if (!location) throw new NotFoundException('location not found.');

    try {
      await this.locationRepository.update(id, updateLocationDto);
      return {
        success: true,
        message: 'Update location successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('failed to update location.');
    }
  }

  async deleteLocation(id: string) {
    const location = await this.locationRepository.findOneById(id);
    if (!location) throw new NotFoundException('location not found.');
    try {
      await this.locationRepository.delete(id);
      return {
        success: true,
        message: 'Delete location successfully',
      };
    } catch (error) {
      console.error(error.message);
      throw new InternalServerErrorException('Failed to delete location');
    }
  }
}
