import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { CreateShowtimeDTO, UpdateShowtimeDTO } from './showtimes.dto';
import { ShowtimesService } from './showtimes.service';

@Controller('movies/:movieId/showtimes')
export class ShowtimesController {
  constructor(private showtimeService: ShowtimesService) {}

  @Get()
  async findAll(@Param('movieId') movieId: string) {
    return this.showtimeService.findShowtimesByMovieId(movieId);
  }

  @Post()
  async create(
    @Param('movieId') movieId: string,
    @Body() createShowtimeDto: CreateShowtimeDTO,
  ) {
    return this.showtimeService.createShowtime({
      ...createShowtimeDto,
      movieId,
    });
  }

  @Get(':id')
  async detail(@Param('id') id: string) {
    return this.showtimeService.detailShowtime(id);
  }

  @Put(':id')
  async update(
    @Param('movieId') movieId: string,
    @Param('id') id: string,
    @Body() updateShowtimeDto: UpdateShowtimeDTO,
  ) {
    return this.showtimeService.updateShowtime(id, {
      ...updateShowtimeDto,
      movieId,
    });
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.showtimeService.deleteShowtime(id);
  }
}
