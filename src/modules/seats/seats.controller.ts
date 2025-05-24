import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CreateSeatsDTO, SeatFilter, UpdateSeatsDTO } from './seats.dto';
import { SeatsService } from './seats.service';

@Controller('seats')
export class SeatsController {
  constructor(private seatsService: SeatsService) {}

  @Get()
  async findAll(@Query() filter: SeatFilter) {
    return this.seatsService.findAllSeatByTheater(filter);
  }

  @Post()
  async create(@Body() createSeatDto: CreateSeatsDTO) {
    return this.seatsService.createSeat(createSeatDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.seatsService.detailSeat(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, updateSeatDto: UpdateSeatsDTO) {
    return this.seatsService.updateSeat(id, updateSeatDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {}
}
