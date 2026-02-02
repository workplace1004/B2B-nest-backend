import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
    rawBody: false,
  });
  
  // Increase body size limit to handle large image uploads (50MB)
  // Access the underlying Express instance and configure body parser
  const expressApp = app.getHttpAdapter().getInstance();
  const express = require('express');
  expressApp.use(express.json({ limit: '50mb' }));
  expressApp.use(express.urlencoded({ limit: '50mb', extended: true }));
  
  // Enable CORS
  const defaultOrigins = [
    'http://localhost:5174',
    'https://b2-b-react-frontend.vercel.app',
    'https://www.b2-b-react-frontend.vercel.app',
  ];
  
  const corsOrigins = process.env.CORS_ORIGIN 
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : defaultOrigins;
  
  // Normalize origins (remove trailing slashes, convert to lowercase for comparison)
  const normalizedOrigins = corsOrigins.map(origin => origin.replace(/\/$/, '').toLowerCase());
  
  console.log('🌐 CORS Configuration:');
  console.log(`   Allowed origins: ${corsOrigins.join(', ')}`);
  
  // Simplified CORS configuration - allow all origins for now to fix the issue
  app.enableCors({
    origin: true, // Allow all origins temporarily
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400, // 24 hours
  });
  
  console.log('✅ CORS enabled for all origins (temporarily for debugging)');
  
  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  
  // Global prefix
  app.setGlobalPrefix('api');
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 HAZEL Backend running on http://localhost:${port}`);
}

bootstrap();

