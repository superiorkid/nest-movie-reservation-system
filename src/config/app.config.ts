import { INestApplication, ValidationPipe } from '@nestjs/common';

export async function appConfig(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      skipNullProperties: true,
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
