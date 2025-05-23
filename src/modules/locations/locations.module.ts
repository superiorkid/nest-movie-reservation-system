import { Module } from '@nestjs/common';
import { LocationsRepository } from './locations.repositry';
import { DatabaseModule } from 'src/shared/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [LocationsRepository],
  exports: [LocationsRepository],
})
export class LocationsModule {}
