import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { FileUploadModule } from 'src/shared/file-upload/file-upload.module';
import { MoviesController } from './movies.controller';
import { MoviesRepository } from './movies.repository';
import { MoviesService } from './movies.service';

@Module({
  imports: [DatabaseModule, FileUploadModule],
  controllers: [MoviesController],
  providers: [MoviesRepository, MoviesService],
  exports: [MoviesRepository],
})
export class MoviesModule {}
