import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS. allow frontend to access backend
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  // Config Swagger
  const config = new DocumentBuilder()
    .setTitle('Credit Platform API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
  console.log('Backend is running on http://localhost:3000');
  console.log('Swagger docs: http://localhost:3000/api-docs');
}
bootstrap();
