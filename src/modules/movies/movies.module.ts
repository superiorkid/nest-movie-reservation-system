import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { FileUploadModule } from 'src/shared/file-upload/file-upload.module';
import { MoviesController } from './movies.controller';
import { MoviesRepository } from './movies.repository';
import { MoviesService } from './movies.service';
import { ShowtimesController } from './showtimes/showtimes.controller';
import { ShowtimesRepository } from './showtimes/showtimes.repository';
import { ShowtimesService } from './showtimes/showtimes.service';

@Module({
  imports: [DatabaseModule, FileUploadModule],
  controllers: [MoviesController, ShowtimesController],
  providers: [
    MoviesRepository,
    MoviesService,
    ShowtimesService,
    ShowtimesRepository,
  ],
  exports: [MoviesRepository, ShowtimesRepository],
})
export class MoviesModule {}
