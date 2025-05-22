import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { CreateGenreDTO, UpdateGenreDTO } from './genres.dto';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private genreService: GenresService) {}

  @Get()
  async findMany() {
    return this.genreService.findGenres();
  }

  @Post()
  async create(@Body() createGenreDto: CreateGenreDTO) {
    return this.genreService.createGenre(createGenreDto);
  }

  @Get(':id')
  async findOne(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.genreService.detailGenre(id);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() updateGenreDto: UpdateGenreDTO,
  ) {
    return this.genreService.updateGenre(id, updateGenreDto);
  }

  @Delete(':id')
  async delete(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return this.genreService.deleteGenre(id);
  }
}
