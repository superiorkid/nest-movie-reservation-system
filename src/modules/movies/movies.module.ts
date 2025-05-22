import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { MoviesController } from './movies.controller';
import { MoviesRepository } from './movies.repository';
import { MoviesService } from './movies.service';
import { FileUploadModule } from 'src/shared/file-upload/file-upload.module';

@Module({
  imports: [DatabaseModule, FileUploadModule],
  controllers: [MoviesController],
  providers: [MoviesRepository, MoviesService],
  exports: [MoviesRepository],
})
export class MoviesModule {}
