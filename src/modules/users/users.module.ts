import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../shared/database/database.module';
import { UserController } from './users.controller';
import { UserRepository } from './users.repository';
import { UserService } from './users.service';
import { ReservationModule } from '../reservation/reservation.module';

@Module({
  imports: [DatabaseModule, ReservationModule],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository],
})
export class UsersModule {}
