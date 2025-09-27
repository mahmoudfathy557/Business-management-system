import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from '../dashboard/dashboard.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ReportsController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('sales')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get sales report' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'carId', required: false, description: 'Filter by car ID' })
  @ApiResponse({ status: 200, description: 'Sales report retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  getSalesReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('carId') carId?: string,
  ) {
    return this.dashboardService.getSalesReport(startDate, endDate, carId);
  }

  @Get('expenses')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get expense report' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'carId', required: false, description: 'Filter by car ID' })
  @ApiResponse({ status: 200, description: 'Expense report retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  getExpenseReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('carId') carId?: string,
  ) {
    return this.dashboardService.getExpenseReport(startDate, endDate, carId);
  }

  @Get('profit')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get profit report' })
  @ApiQuery({ name: 'startDate', required: true, description: 'Start date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'endDate', required: true, description: 'End date (YYYY-MM-DD)' })
  @ApiQuery({ name: 'carId', required: false, description: 'Filter by car ID' })
  @ApiResponse({ status: 200, description: 'Profit report retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  getProfitReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('carId') carId?: string,
  ) {
    return this.dashboardService.getProfitReport(startDate, endDate, carId);
  }
}
