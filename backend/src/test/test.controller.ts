import {
  Controller,
  Get,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { TestService } from './test.service';

@ApiTags('Test')
@Controller('test')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class TestController {
  constructor(private readonly testService: TestService) {}

  @Get('comprehensive-data')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Get comprehensive test data showing all table relationships',
    description: 'Returns a complex data structure demonstrating how all entities are linked together including users, cars, products, expenses, and their relationships'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Comprehensive test data retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        summary: {
          type: 'object',
          properties: {
            totalUsers: { type: 'number' },
            totalCars: { type: 'number' },
            totalProducts: { type: 'number' },
            totalExpenses: { type: 'number' },
            totalDailyRecords: { type: 'number' }
          }
        },
        users: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string' },
              role: { type: 'string' },
              assignedCars: { type: 'array' },
              totalExpenses: { type: 'number' },
              totalSales: { type: 'number' }
            }
          }
        },
        cars: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              plateNumber: { type: 'string' },
              model: { type: 'string' },
              driver: { type: 'object' },
              assignedProducts: { type: 'array' },
              dailyRecords: { type: 'array' },
              totalSales: { type: 'number' },
              totalExpenses: { type: 'number' },
              profit: { type: 'number' }
            }
          }
        },
        products: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              _id: { type: 'string' },
              name: { type: 'string' },
              category: { type: 'string' },
              currentStock: { type: 'number' },
              assignedToCars: { type: 'array' },
              totalSold: { type: 'number' },
              totalRevenue: { type: 'number' }
            }
          }
        },
        relationships: {
          type: 'object',
          properties: {
            userCarAssignments: { type: 'array' },
            carProductAssignments: { type: 'array' },
            expenseUserRelations: { type: 'array' },
            dailyRecordRelations: { type: 'array' }
          }
        }
      }
    }
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin or Super Admin role required' })
  @ApiQuery({ 
    name: 'includeInactive', 
    required: false, 
    type: Boolean, 
    description: 'Include inactive users and cars in the results' 
  })
  async getComprehensiveTestData(@Query('includeInactive') includeInactive?: boolean) {
    return this.testService.getComprehensiveTestData(includeInactive);
  }

  @Get('relationship-integrity')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Test relationship integrity between all entities',
    description: 'Validates that all foreign key relationships are properly maintained and identifies any orphaned records'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Relationship integrity check completed',
    schema: {
      type: 'object',
      properties: {
        integrityCheck: {
          type: 'object',
          properties: {
            orphanedRecords: { type: 'object' },
            missingReferences: { type: 'object' },
            dataConsistency: { type: 'object' }
          }
        },
        recommendations: { type: 'array', items: { type: 'string' } }
      }
    }
  })
  async testRelationshipIntegrity() {
    return this.testService.testRelationshipIntegrity();
  }

  @Get('performance-metrics')
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiOperation({ 
    summary: 'Get performance metrics across all entities',
    description: 'Returns performance metrics showing how well the system is performing across different entities and relationships'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Performance metrics retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        topPerformingCars: { type: 'array' },
        topSellingProducts: { type: 'array' },
        mostActiveUsers: { type: 'array' },
        expenseBreakdown: { type: 'object' },
        salesTrends: { type: 'object' }
      }
    }
  })
  async getPerformanceMetrics() {
    return this.testService.getPerformanceMetrics();
  }
}
