import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../shared/database/database.module';
import { UserRepository } from './users.repository';

@Module({
  imports: [DatabaseModule],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UsersModule {}
