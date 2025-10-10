import { OmitType } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  IsDateString,
  ValidateNested,
  IsArray,
  ValidateIf,
} from 'class-validator';
import { Car } from '../schemas/car.schema';

export class CreateCarDto {
  @IsString()
  @IsNotEmpty()
  plateNumber: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year: number;

  @IsOptional()
  @ValidateIf(
    (object, value) => value !== null && value !== undefined && value !== '',
  )
  @IsMongoId()
  driverId?: string | null;
}

export class UpdateCarDto {
  @IsOptional()
  @IsString()
  plateNumber?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Min(1900)
  @Max(new Date().getFullYear() + 1)
  year?: number;

  @IsOptional()
  @ValidateIf(
    (object, value) => value !== null && value !== undefined && value !== '',
  )
  @IsMongoId()
  driverId?: string | null;

  @IsOptional()
  isActive?: boolean;
}

export class AssignProductDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class SaleItemDto {
  @IsString()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class DailyRecordDto {
  @IsString()
  @IsNotEmpty()
  carId: string;

  @IsString()
  @IsNotEmpty()
  driverId: string;

  @IsDateString()
  @IsNotEmpty()
  date: string;

  @IsNumber()
  @Min(0)
  totalSales: number;

  @IsNumber()
  @Min(0)
  totalExpenses: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SaleItemDto)
  sales: SaleItemDto[];

  @IsOptional()
  @IsString()
  notes?: string;
}
