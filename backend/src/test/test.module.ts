import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestController } from './test.controller';
import { TestService } from './test.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Car, CarSchema } from '../cars/schemas/car.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { Expense, ExpenseSchema } from '../expenses/schemas/expense.schema';
import { DailyRecord, DailyRecordSchema } from '../cars/schemas/daily-record.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Car.name, schema: CarSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Expense.name, schema: ExpenseSchema },
      { name: DailyRecord.name, schema: DailyRecordSchema },
    ]),
  ],
  controllers: [TestController],
  providers: [TestService],
  exports: [TestService],
})
export class TestModule {}
