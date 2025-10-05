import { NestFactory, Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { EmptyStringToNullPipe } from './common/pipes/empty-string-to-null.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:19006', // Expo web
      'http://localhost:8081', // Expo dev server
      'exp://192.168.1.8:8081', // Expo Go on your network
      'exp://localhost:8081', // Expo Go local
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
    new EmptyStringToNullPipe(),
  );

  // Global response interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Business Management System API')
    .setDescription('API documentation for the Business Management System')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management endpoints (Super Admin, Admin)')
    .addTag('Cars', 'Car management endpoints')
    .addTag('Products', 'Product management endpoints')
    .addTag('Expenses', 'Expense management endpoints')
    .addTag('Dashboard', 'Dashboard data endpoints')
    .addTag('Reports', 'Reports endpoints')
    .addTag('Seed', 'Database seeding endpoints (Super Admin only)')
    .addTag(
      'Test',
      'Test endpoints for data validation and relationship testing (Super Admin, Admin)',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = configService.get('PORT') || 3000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 Application is running on: http://localhost:${port}/api`);
  console.log(`🚀 Network access: http://192.168.1.8:${port}/api`);
  console.log(
    `📚 Swagger documentation available at: http://localhost:${port}/api/docs`,
  );
}
bootstrap();
