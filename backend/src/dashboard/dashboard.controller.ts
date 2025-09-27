import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Dashboard')
@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('summary')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER, UserRole.DRIVER)
  @ApiOperation({ summary: 'Get dashboard summary' })
  @ApiResponse({ status: 200, description: 'Dashboard summary retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin, Inventory Manager, or Driver role required' })
  getDashboardSummary() {
    return this.dashboardService.getDashboardSummary();
  }

  @Get('inventory')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Get inventory summary' })
  @ApiResponse({ status: 200, description: 'Inventory summary retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Inventory Manager role required' })
  getInventorySummary() {
    return this.dashboardService.getInventorySummary();
  }

  @Get('car-performance')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get car performance data' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Car performance data retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  getCarPerformance(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.dashboardService.getCarPerformance(startDate, endDate);
  }

  @Get('financial-summary')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get financial summary' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' })
  @ApiResponse({ status: 200, description: 'Financial summary retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  getFinancialSummary(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.dashboardService.getFinancialSummary(startDate, endDate);
  }
}
