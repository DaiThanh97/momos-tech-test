import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import * as compression from 'compression';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security middleware
  app.use(helmet());

  // Compression middleware for responses
  app.use(compression());

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');
  const apiVersionPrefix = configService.get<string>('API_VERSION_PREFIX');
  app.setGlobalPrefix(apiVersionPrefix ?? '');

  if (!port) {
    throw new Error('Cannot find PORT in config');
  }

  // Document
  const config = new DocumentBuilder()
    .setTitle('Media Scraper')
    .setDescription('Apis document for client')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'Authentication',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiVersionPrefix}/docs`, app, document);

  await app.listen(port).then(() => {
    console.log(`🚀  Server is ready at ${port}`);
    console.log(
      `🚀  Docs are ready at http://localhost:${port}${apiVersionPrefix}/docs`,
    );
  });
}
bootstrap();
