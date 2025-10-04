import {
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

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
  @IsMongoId()
  driverId?: string;
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
  @IsMongoId()
  driverId?: string;

  @IsOptional()
  isActive?: boolean;
}

export class AssignProductDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  productId: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}

export class DailyRecordDto {
  @IsString()
  @IsNotEmpty()
  @IsMongoId()
  carId: string;

  @IsNumber()
  @Min(0)
  income: number;

  @IsNumber()
  @Min(0)
  expenses: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
