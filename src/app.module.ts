import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { join } from 'path';
import { AdminModule } from './modules/admin/admin.module';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { GenresModule } from './modules/genres/genres.module';
import { LocationsModule } from './modules/locations/locations.module';
import { MoviesModule } from './modules/movies/movies.module';
import { ReservationModule } from './modules/reservation/reservation.module';
import { SeatReservationModule } from './modules/seat-reservations/seat-reservation.module';
import { SeatModule } from './modules/seats/seats.module';
import { ShowtimesModule } from './modules/showtimes/showtimes.module';
import { TheatersModule } from './modules/theaters/theaters.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './shared/database/database.module';
import { EmailModule } from './shared/email/email.module';
import { EncryptModule } from './shared/encrypt/encrypt.module';
import { TypedEventEmitterModule } from './shared/event-emitter/typed-event-emitter.module';
import { PaymentModule } from './shared/payment/payment.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/assets',
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 10 }],
    }),
    NestjsFormDataModule.config({ isGlobal: true, storage: MemoryStoredFile }),
    EmailModule,
    EventEmitterModule.forRoot(),
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
    PaymentModule,
    ReservationModule,
    SeatReservationModule,
    TypedEventEmitterModule,
    AdminModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
