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
  Put,
  UsePipes,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CarsService } from './cars.service';
import {
  CreateCarDto,
  UpdateCarDto,
  AssignProductDto,
  DailyRecordDto,
} from './dto/car.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/schemas/user.schema';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { EmptyStringToNullPipe } from 'src/common/pipes/empty-string-to-null.pipe';

@ApiTags('Cars')
@Controller('cars')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth('JWT-auth')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a new car' })
  @ApiBody({ type: CreateCarDto })
  @ApiResponse({ status: 201, description: 'Car created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @UsePipes(new EmptyStringToNullPipe())
  create(@Body() createCarDto: CreateCarDto) {
    return this.carsService.create(createCarDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all cars' })
  @ApiResponse({ status: 200, description: 'Cars retrieved successfully' })
  findAll() {
    return this.carsService.findAll();
  }

  @Get('unassigned')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get unassigned cars' })
  @ApiResponse({
    status: 200,
    description: 'Unassigned cars retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  getUnassignedCars() {
    return this.carsService.getUnassignedCars();
  }

  @Get('driver/:driverId')
  @Roles(UserRole.ADMIN, UserRole.DRIVER)
  @ApiOperation({ summary: 'Get cars by driver' })
  @ApiParam({ name: 'driverId', description: 'Driver ID' })
  @ApiResponse({
    status: 200,
    description: 'Cars by driver retrieved successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Driver role required',
  })
  getCarsByDriver(@Param('driverId') driverId: string) {
    return this.carsService.getCarsByDriver(driverId);
  }

  @Get('stats')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get car statistics' })
  @ApiResponse({
    status: 200,
    description: 'Car statistics retrieved successfully',
  })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  getStats() {
    return Promise.all([
      this.carsService.getTotalCarsCount(),
      this.carsService.getAssignedCarsCount(),
      this.carsService.getUnassignedCarsCount(),
    ]).then(([total, assigned, unassigned]) => ({
      total,
      assigned,
      unassigned,
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get car by ID' })
  @ApiParam({ name: 'id', description: 'Car ID' })
  @ApiResponse({ status: 200, description: 'Car retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update car' })
  @ApiParam({ name: 'id', description: 'Car ID' })
  @ApiBody({ type: UpdateCarDto })
  @ApiResponse({ status: 200, description: 'Car updated successfully' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  @UsePipes(new EmptyStringToNullPipe())
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(id, updateCarDto);
  }

  @Post(':id/products')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Assign product to car' })
  @ApiParam({ name: 'id', description: 'Car ID' })
  @ApiBody({ type: AssignProductDto })
  @ApiResponse({ status: 200, description: 'Product assigned successfully' })
  @ApiResponse({ status: 404, description: 'Car or product not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Inventory Manager role required',
  })
  assignProduct(
    @Param('id') carId: string,
    @Body() assignProductDto: AssignProductDto,
  ) {
    return this.carsService.assignProduct(carId, assignProductDto);
  }

  @Delete(':id/products/:productId')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Remove product from car' })
  @ApiParam({ name: 'id', description: 'Car ID' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiResponse({ status: 200, description: 'Product removed successfully' })
  @ApiResponse({ status: 404, description: 'Car or product not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Inventory Manager role required',
  })
  removeProduct(
    @Param('id') carId: string,
    @Param('productId') productId: string,
  ) {
    return this.carsService.removeProduct(carId, productId);
  }

  @Patch(':id/products/:productId/quantity')
  @Roles(UserRole.ADMIN, UserRole.INVENTORY_MANAGER)
  @ApiOperation({ summary: 'Update product quantity in car' })
  @ApiParam({ name: 'id', description: 'Car ID' })
  @ApiParam({ name: 'productId', description: 'Product ID' })
  @ApiBody({
    schema: { type: 'object', properties: { quantity: { type: 'number' } } },
  })
  @ApiResponse({
    status: 200,
    description: 'Product quantity updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Car or product not found' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Inventory Manager role required',
  })
  updateProductQuantity(
    @Param('id') carId: string,
    @Param('productId') productId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.carsService.updateProductQuantity(carId, productId, quantity);
  }

  @Post('daily-record')
  @Roles(UserRole.ADMIN, UserRole.DRIVER)
  @ApiOperation({ summary: 'Create daily record' })
  @ApiBody({ type: DailyRecordDto })
  @ApiResponse({
    status: 201,
    description: 'Daily record created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Admin or Driver role required',
  })
  createDailyRecord(@Body() dailyRecordDto: DailyRecordDto) {
    return this.carsService.createDailyRecord(dailyRecordDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete car' })
  @ApiParam({ name: 'id', description: 'Car ID' })
  @ApiResponse({ status: 200, description: 'Car deleted successfully' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  @ApiResponse({ status: 403, description: 'Forbidden - Admin role required' })
  remove(@Param('id') id: string) {
    return this.carsService.remove(id);
  }
}
