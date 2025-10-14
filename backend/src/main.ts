import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Global Validation Pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Automatically remove properties not defined in DTO
      forbidNonWhitelisted: true, // Throw an error on undefined properties.
      transform: true, // Automatic type conversion
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Config Swagger
  const config = new DocumentBuilder()
    .setTitle('Credit Platform API')
    .setDescription(
      'API for managing credit institution profiles and loan tokenization',
    )
    .setVersion('1.0')
    .addTag('Profile', 'Credit institution profile management')
    .addTag('Loan', 'Loan management and tokenization')
    .addTag('Dashboard', 'Dashboard statistics and analytics')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log('Backend is running on http://localhost:' + port);
  console.log('Swagger docs: http://localhost:' + port + '/api-docs');
  console.log('Database: PostgreSQL');
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});
