import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SeedService } from './seed.service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@ApiTags('Seed')
@Controller('seed')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Seed the database with initial data' })
  @ApiResponse({ status: 201, description: 'Database seeded successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async seedDatabase() {
    const result = await this.seedService.seedDatabase();
    return {
      message: 'Database seeded successfully',
      data: result,
    };
  }

  @Post('assign-products')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Assign products to cars' })
  @ApiResponse({ status: 201, description: 'Products assigned to cars successfully' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  async assignProductsToCars() {
    await this.seedService.assignProductsToCars();
    return {
      message: 'Products assigned to cars successfully',
    };
  }
}
