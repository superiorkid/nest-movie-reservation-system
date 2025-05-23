import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/shared/database/database.module';
import { TheatersController } from './theaters.controller';
import { TheatersRepository } from './theaters.repository';
import { TheatersService } from './theaters.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TheatersController],
  providers: [TheatersRepository, TheatersService],
  exports: [TheatersRepository],
})
export class TheatersModule {}
