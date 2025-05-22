import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { FormDataRequest } from 'nestjs-form-data';
import { Roles } from 'src/common/decorators/roles.decorator';
import { CreateMovieDTO, UpdateMovieDTO } from './movies.dto';
import { MoviesService } from './movies.service';

@Controller('movies')
export class MoviesController {
  constructor(private moviesService: MoviesService) {}

  @Get()
  async findMany() {
    return this.moviesService.findMany();
  }

  @Post()
  @FormDataRequest()
  @Roles(Role.ADMIN)
  async create(@Body() createMovieDto: CreateMovieDTO) {
    return this.moviesService.create(createMovieDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.moviesService.movieDetail(id);
  }

  @Roles(Role.ADMIN)
  @Put(':id')
  @FormDataRequest()
  async update(
    @Param('id') id: string,
    @Body() updateMovieDto: UpdateMovieDTO,
  ) {
    return this.moviesService.update(id, updateMovieDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.moviesService.delete(id);
  }
}
