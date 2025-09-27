import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { ProductsModule } from '../products/products.module';
import { CarsModule } from '../cars/cars.module';
import { ExpensesModule } from '../expenses/expenses.module';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    ProductsModule,
    CarsModule,
    ExpensesModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
  exports: [DashboardService],
})
export class DashboardModule {}
