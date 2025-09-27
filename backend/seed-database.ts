import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { SeedService } from './src/seed/seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const seedService = app.get(SeedService);

  try {
    console.log('🌱 Starting database seeding...');
    const result = await seedService.seedDatabase();
    await seedService.assignProductsToCars();
    
    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Summary:', result);
    
    console.log('\n🔑 Login Credentials:');
    console.log('Super Admin: superadmin@mobileaccessories.com / password123');
    console.log('Admin: admin@mobileaccessories.com / password123');
    console.log('Inventory Manager: inventory@mobileaccessories.com / password123');
    console.log('Driver 1: driver1@mobileaccessories.com / password123');
    console.log('Driver 2: driver2@mobileaccessories.com / password123');
    console.log('Driver 3: driver3@mobileaccessories.com / password123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
