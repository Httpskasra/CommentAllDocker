import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const cfg = app.get(ConfigService);
  app.enableCors({ origin: cfg.get('CORS_ORIGIN'), credentials: true });

  await app.listen(cfg.get('PORT') || 3001);
}
bootstrap();
