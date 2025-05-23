import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateLocationDTO, UpdateLocationDTO } from './locations.dto';
import { LocationService } from './locations.service';

@Controller('locations')
export class LocationsController {
  constructor(private locationService: LocationService) {}

  @Get()
  async findAll() {
    return this.locationService.allLocations();
  }

  @Post()
  async create(@Body() createLocationDto: CreateLocationDTO) {
    return this.locationService.createLocation(createLocationDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.locationService.detailLocation(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateLocationDto: UpdateLocationDTO,
  ) {
    return this.locationService.updateLocation(id, updateLocationDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.locationService.deleteLocation(id);
  }
}
