import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { GenresController } from './genres.controller';
import { GenresRepository } from './genres.repository';
import { GenresService } from './genres.service';

@Module({
  imports: [DatabaseModule],
  controllers: [GenresController],
  providers: [GenresRepository, GenresService],
  exports: [GenresRepository],
})
export class GenresModule {}
