import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SharedConfig } from './Shared/shared.config';
import * as morgan from 'morgan';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({origin: true, credentials: true})

  app.use(morgan('dev'))
  app.use(json({ limit: '10mb' }));

  await app.listen(SharedConfig.serverPort);
}
bootstrap();
