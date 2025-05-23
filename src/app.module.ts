import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { join } from 'path';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { GenresModule } from './modules/genres/genres.module';
import { MoviesModule } from './modules/movies/movies.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './shared/database/database.module';
import { EncryptModule } from './shared/encrypt/encrypt.module';
import { LocationsModule } from './modules/locations/locations.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
