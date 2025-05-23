import { Module } from '@nestjs/common';
import { LocationsRepository } from './locations.repositry';
import { DatabaseModule } from 'src/shared/database/database.module';
import { LocationsController } from './locations.controller';
import { LocationService } from './locations.service';

@Module({
  imports: [DatabaseModule],
  controllers: [LocationsController],
  providers: [LocationsRepository, LocationService],
  exports: [LocationsRepository],
})
export class LocationsModule {}
