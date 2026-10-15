import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { join } from 'path';
import * as fs from 'fs';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const uploadsDir = join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));
  app.useStaticAssets(uploadsDir, { prefix: '/uploads' });


  // Secure CORS with strictly enforced origin allow-list
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:5174',
    'https://freshioz.com',
    'https://www.freshioz.com',
    'https://api.freshioz.com',
  ];
  if (process.env.FRONTEND_URL) allowedOrigins.push(process.env.FRONTEND_URL);
  if (process.env.ADMIN_URL) allowedOrigins.push(process.env.ADMIN_URL);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow non-browser requests (mobile apps, curl, Postman), explicit allowed origins, local dev, or freshioz.com subdomains
      if (
        !origin || 
        allowedOrigins.includes(origin) || 
        /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin) ||
        /^https:\/\/([a-zA-Z0-9-]+\.)?freshioz(z)?\.com$/.test(origin)
      ) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} blocked by CORS policy`), false);
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Global prefix for all API endpoints
  app.setGlobalPrefix('api');

  // Global input validation and transformation with whitelist filtering
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Enterprise Swagger / OpenAPI Documentation
  const config = new DocumentBuilder()
    .setTitle('Freshioz Enterprise API')
    .setDescription(
      'Farm-to-Fork Direct Supply Chain Backend for Bengaluru APMC Mandi, Warehouses, Society Desks & Resident Orders.\n' +
        'Dates formatted in DD/MM/YYYY and Indian Standard Time (IST).',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT Bearer token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Freshioz API Documentation',
  });

  const PORT = process.env.PORT || 5000;
  await app.listen(PORT);

  console.log(`\n==================================================`);
  console.log(`🚀 Freshioz NestJS Backend running on: http://localhost:${PORT}/api`);
  console.log(`📖 Swagger API Documentation: http://localhost:${PORT}/api/docs`);
  console.log(`⏰ Timezone: Asia/Kolkata (IST) | Date Format: DD/MM/YYYY`);
  console.log(`==================================================\n`);
}

bootstrap();
