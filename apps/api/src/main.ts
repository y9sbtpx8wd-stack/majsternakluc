import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AdminGateway } from './modules/admin/admin.gateway';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // ---------------------------------------------------------
  // 🔥 Swagger konfigurácia
  // ---------------------------------------------------------
  const config = new DocumentBuilder()
    .setTitle('MajsterNaKľúč API')
    .setDescription('API dokumentácia pre backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // ---------------------------------------------------------
  // 🔥 Global prefix
  // ---------------------------------------------------------
  app.setGlobalPrefix('api');

  // ---------------------------------------------------------
  // 🔥 Cookie parser
  // ---------------------------------------------------------
  app.use(cookieParser());

  // ---------------------------------------------------------
  // 🔥 CORS
  // ---------------------------------------------------------
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  // ---------------------------------------------------------
  // 🔥 Global validation
  // ---------------------------------------------------------
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // ---------------------------------------------------------
  // 🔥 Hybridný request logger (volá AdminGateway)
  // ---------------------------------------------------------
  const gateway = app.get(AdminGateway);

  app.use((req, res, next) => {
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;

      gateway.emitApiRequestLog({
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        duration,
        time: new Date(),
      });
    });

    next();
  });

  // ---------------------------------------------------------
  // 🔥 Spustenie servera
  // ---------------------------------------------------------
  await app.listen(process.env.PORT || 4000, '0.0.0.0');
}

bootstrap();

