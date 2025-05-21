import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './modules/authentication/authentication.module';
import { UsersModule } from './modules/users/users.module';
import { DatabaseModule } from './shared/database/database.module';
import { EncryptModule } from './shared/encrypt/encrypt.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthenticationModule,
    DatabaseModule,
    EncryptModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
