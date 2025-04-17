import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { SanitizePipe } from 'src/common/pipe/sanitize.pipe';
import { AppModule } from 'src/modules/app/app.module';

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
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
