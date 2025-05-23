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
import { CreateShowtimeDTO, UpdateShowtimeDTO } from './showtimes.dto';
import { ShowtimesService } from './showtimes.service';

@Controller('showtimes')
export class ShowtimesController {
  constructor(private showtimeService: ShowtimesService) {}

  @Get()
  async findAll(@Query('movie_id') movieId: string) {
    return this.showtimeService.findShowtimesByMovieId(movieId);
  }

  @Post()
  async create(@Body() createShowtimeDto: CreateShowtimeDTO) {
    return this.showtimeService.createShowtime(createShowtimeDto);
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.showtimeService.detailShowtime(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateShowtimeDto: UpdateShowtimeDTO,
  ) {
    return this.showtimeService.updateShowtime(id, updateShowtimeDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.showtimeService.deleteShowtime(id);
  }
}
