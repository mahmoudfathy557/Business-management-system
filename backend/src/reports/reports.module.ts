import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller';
import { DashboardModule } from '../dashboard/dashboard.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [DashboardModule, AuthModule],
  controllers: [ReportsController],
})
export class ReportsModule {}
