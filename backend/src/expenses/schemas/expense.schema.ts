import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum ExpenseType {
  FUEL = 'fuel',
  MAINTENANCE = 'maintenance',
  SALARY = 'salary',
  OTHER = 'other',
}

@Schema({ timestamps: true })
export class Expense {
  @Prop({ required: true, enum: ExpenseType })
  type: ExpenseType;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ required: true })
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'Car' })
  car?: Types.ObjectId;

  @Prop({ required: true, default: Date.now })
  date: Date;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @Prop({ default: true })
  isActive: boolean;
}

export type ExpenseDocument = Expense & Document;
export const ExpenseSchema = SchemaFactory.createForClass(Expense);
