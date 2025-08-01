import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  // Cookie parser
  app.use(cookieParser());
  // Built-in CORS handler (NestJS-level)
  app.enableCors({
    origin: 'https://stat-app-web.vercel.app/',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // ValidationPipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port: string | number = process.env.PORT || 2000;
  await app.listen(port, '0.0.0.0');
}

bootstrap();
