import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CarsService } from './cars.service';
import { CarsController } from './cars.controller';
import { Car, CarSchema } from './schemas/car.schema';
import { DailyRecord, DailyRecordSchema } from './schemas/daily-record.schema';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Car.name, schema: CarSchema },
      { name: DailyRecord.name, schema: DailyRecordSchema },
    ]),
    AuthModule,
  ],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
