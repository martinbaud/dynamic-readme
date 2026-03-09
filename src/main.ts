import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: process.env.NODE_ENV === "development"
      ? ['log', 'debug', 'verbose', 'warn', 'error', 'fatal']
      : ['log', 'warn', 'error', 'fatal']
  });
  app.useBodyParser('json', { limit: '100mb' });
  app.enableCors();
  // Serve static assets (minecraft sprites, etc.)
  // In dev: ../public, in prod (dist): ./public
  const publicPath = process.env.NODE_ENV === 'production'
    ? join(__dirname, 'public')
    : join(__dirname, '..', 'public');
  app.useStaticAssets(publicPath);
  await app.listen(process.env.APP_PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
