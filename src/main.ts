import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fastifyCookie from '@fastify/cookie';

import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true },
  );

  app.register(require('@fastify/cookie').default, {
    secret: 'your-secret-key', // Optional, if you want to sign the cookies
    parseOptions: {}, // Optional cookie parsing options
  });

  await app.listen(3000);
}
bootstrap();
