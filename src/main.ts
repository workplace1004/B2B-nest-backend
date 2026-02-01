import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
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
  
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log('✅ CORS: Allowing request with no origin');
        return callback(null, true);
      }
      
      // Normalize the incoming origin
      const normalizedOrigin = origin.replace(/\/$/, '').toLowerCase();
      
      // Check if origin is in allowed list or if wildcard is enabled
      if (normalizedOrigins.includes(normalizedOrigin) || corsOrigins.includes('*')) {
        console.log(`✅ CORS: Allowing origin: ${origin}`);
        callback(null, true);
      } else {
        // Log for debugging
        console.log(`⚠️  CORS: Origin not in list: ${origin}`);
        console.log(`   Normalized: ${normalizedOrigin}`);
        console.log(`   Allowed origins: ${corsOrigins.join(', ')}`);
        // Temporarily allow all origins for debugging - remove this after testing
        console.log(`   ⚠️  TEMPORARILY ALLOWING for debugging`);
        callback(null, true);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
    maxAge: 86400, // 24 hours
  });
  
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
  
  // Additional CORS handling for OPTIONS requests (backup to ensure CORS works)
  const normalizedOriginsForMiddleware = corsOrigins.map(o => o.replace(/\/$/, '').toLowerCase());
  
  app.use((req: any, res: any, next: any) => {
    const origin = req.headers.origin;
    
    // Set CORS headers for all requests (temporarily for debugging)
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
      res.setHeader('Access-Control-Max-Age', '86400');
      console.log(`🔧 Middleware: Set CORS headers for origin: ${origin}`);
    }
    
    // Handle preflight OPTIONS requests
    if (req.method === 'OPTIONS') {
      console.log('🔧 Middleware: Handling OPTIONS preflight request');
      return res.status(204).send();
    }
    
    next();
  });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 HAZEL Backend running on http://localhost:${port}`);
}

bootstrap();

