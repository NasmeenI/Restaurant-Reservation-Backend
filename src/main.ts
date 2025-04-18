import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { SanitizePipe } from 'src/common/pipe/sanitize.pipe';
import { AppModule } from 'src/modules/app/app.module';
import hpp from 'hpp';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new SanitizePipe(),
    new ValidationPipe({
      whitelist: true, // Strip properties that don't exist in the DTO
      forbidNonWhitelisted: true, // Throw an error if there are non-whitelisted properties
      transform: true, // Automatically transform payloads to DTO types
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.use(helmet());
  app.use(hpp());

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Restaurant Reservation API')
    .setDescription('API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Create Swagger document
  const document = SwaggerModule.createDocument(app, config);

  // Set up Swagger UI at a specific endpoint (e.g., /api-docs)
  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep auth token between refreshes
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
