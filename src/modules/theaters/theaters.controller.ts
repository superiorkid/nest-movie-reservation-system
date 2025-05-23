import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { TheatersService } from './theaters.service';
import { CreateTheatersDTO, UpdateTheatersDTO } from './theates.dto';

@Controller('theaters')
export class TheatersController {
  constructor(private theaterService: TheatersService) {}

  @Get()
  async findAll() {
    return this.theaterService.findAllTheater();
  }

  @Post()
  async create(@Body() createTheaterDto: CreateTheatersDTO) {
    return this.theaterService.createTheater(createTheaterDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.theaterService.detailTheater(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTheaterDto: UpdateTheatersDTO,
  ) {
    return this.theaterService.updateTheater(id, updateTheaterDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.theaterService.deleteTheater(id);
  }
}
