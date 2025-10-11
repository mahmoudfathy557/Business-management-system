import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { ExpensesService } from './expenses.service';
import {
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseReportDto,
} from './dto/expense.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Expenses')
@Controller('expenses')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DRIVER)
  @ApiOperation({ summary: 'Create a new expense' })
  @ApiBody({ type: CreateExpenseDto })
  @ApiResponse({ status: 201, description: 'Expense created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Driver role required',
  })
  create(@Body() createExpenseDto: CreateExpenseDto, @Request() req) {
    return this.expensesService.create(createExpenseDto, req.user.userId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all expenses with pagination' })
  @ApiQuery({ name: 'page', required: false, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, description: 'Items per page' })
  @ApiQuery({
    name: 'period',
    required: false,
    description: 'Filter by period (today, week, month, year) or car ID',
  })
  @ApiResponse({ status: 200, description: 'Expenses retrieved successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('period') period?: string,
  ) {
    return this.expensesService.findAll(
      parseInt(page),
      parseInt(limit),
      period,
    );
  }

  @Get('report')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get expense report by date range' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiQuery({ name: 'car', required: false, description: 'Filter by car ID' })
  @ApiResponse({
    status: 200,
    description: 'Expense report retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  getExpenseReport(@Query() expenseReportDto: ExpenseReportDto) {
    return this.expensesService.getExpensesByDateRange(
      expenseReportDto.startDate,
      expenseReportDto.endDate,
      expenseReportDto.car,
    );
  }

  @Get('report/by-type')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get expenses report grouped by type' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiQuery({ name: 'car', required: false, description: 'Filter by car ID' })
  @ApiResponse({
    status: 200,
    description: 'Expenses by type report retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  getExpensesByTypeReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('car') car?: string,
  ) {
    return this.expensesService.getExpensesByTypeReport(
      startDate,
      endDate,
      car,
    );
  }

  @Get('report/by-car')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get expenses report grouped by car' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Expenses by car report retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  getExpensesByCarReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.expensesService.getExpensesByCarReport(startDate, endDate);
  }

  @Get('report/trend')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get monthly expense trend' })
  @ApiQuery({
    name: 'startDate',
    required: true,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: true,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiQuery({ name: 'car', required: false, description: 'Filter by car ID' })
  @ApiResponse({
    status: 200,
    description: 'Monthly expense trend retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  getMonthlyExpenseTrend(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('car') car?: string,
  ) {
    return this.expensesService.getMonthlyExpenseTrend(startDate, endDate, car);
  }

  @Get('total')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get total expenses' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiQuery({ name: 'car', required: false, description: 'Filter by car ID' })
  @ApiResponse({
    status: 200,
    description: 'Total expenses retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  getTotalExpenses(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('car') car?: string,
  ) {
    return this.expensesService.getTotalExpenses(startDate, endDate, car);
  }

  @Get('type/:type')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get expenses by type' })
  @ApiParam({ name: 'type', description: 'Expense type' })
  @ApiQuery({
    name: 'startDate',
    required: false,
    description: 'Start date (YYYY-MM-DD)',
  })
  @ApiQuery({
    name: 'endDate',
    required: false,
    description: 'End date (YYYY-MM-DD)',
  })
  @ApiResponse({
    status: 200,
    description: 'Expenses by type retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  getExpensesByType(
    @Param('type') type: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.expensesService.getExpensesByType(type, startDate, endDate);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get expense by ID' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  @ApiResponse({ status: 200, description: 'Expense retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  findOne(@Param('id') id: string) {
    return this.expensesService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update expense' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  @ApiBody({ type: UpdateExpenseDto })
  @ApiResponse({ status: 200, description: 'Expense updated successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expensesService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete expense' })
  @ApiParam({ name: 'id', description: 'Expense ID' })
  @ApiResponse({ status: 200, description: 'Expense deleted successfully' })
  @ApiResponse({ status: 404, description: 'Expense not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  remove(@Param('id') id: string) {
    return this.expensesService.remove(id);
  }
}
