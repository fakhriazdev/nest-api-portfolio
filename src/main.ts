import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(3000);
  console.log('Nest application is running!');
}

bootstrap();

// Function to check connection
async function checkConnection() {
  try {
    await NestFactory.create(AppModule);
    // Perform any necessary checks here
    console.log('Connection to Nest application successful!');
  } catch (error) {
    console.error('Error connecting to Nest application:', error);
  }
}

// Call the function to check connection
checkConnection();
