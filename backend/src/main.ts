import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SharedConfig } from './Shared/shared.config';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({origin: true, credentials: true})

  app.use(morgan('dev'))

  await app.listen(SharedConfig.serverPort);
}
bootstrap();
