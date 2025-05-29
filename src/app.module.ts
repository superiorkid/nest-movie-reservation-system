import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { join } from 'path';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { GenresModule } from './modules/genres/genres.module';
import { LocationsModule } from './modules/locations/locations.module';
import { MoviesModule } from './modules/movies/movies.module';
import { SeatReservationModule } from './modules/seat-reservations/seat-reservation.module';
import { SeatModule } from './modules/seats/seats.module';
import { ShowtimesModule } from './modules/showtimes/showtimes.module';
import { TheatersModule } from './modules/theaters/theaters.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './shared/database/database.module';
import { EncryptModule } from './shared/encrypt/encrypt.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/assets',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    NestjsFormDataModule.config({ isGlobal: true, storage: MemoryStoredFile }),
    UsersModule,
    AuthenticationModule,
    DatabaseModule,
    EncryptModule,
    MoviesModule,
    GenresModule,
    LocationsModule,
    TheatersModule,
    ShowtimesModule,
    SeatModule,
    SeatReservationModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
