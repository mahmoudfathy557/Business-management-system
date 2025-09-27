import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ExpenseType } from '../schemas/expense.schema';

export class CreateExpenseDto {
  @IsEnum(ExpenseType)
  type: ExpenseType;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  carId?: string;

  @IsDateString()
  date: string;
}

export class UpdateExpenseDto {
  @IsOptional()
  @IsEnum(ExpenseType)
  type?: ExpenseType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  carId?: string;

  @IsOptional()
  @IsDateString()
  date?: string;
}

export class ExpenseReportDto {
  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  carId?: string;

  @IsOptional()
  @IsEnum(ExpenseType)
  type?: ExpenseType;
}
