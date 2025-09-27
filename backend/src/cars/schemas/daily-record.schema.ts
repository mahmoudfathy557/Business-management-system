import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class SaleItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop({ required: true, min: 0 })
  price: number;
}

@Schema({ timestamps: true })
export class DailyRecord {
  @Prop({ type: Types.ObjectId, ref: 'Car', required: true })
  carId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  driverId: Types.ObjectId;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true, min: 0 })
  totalSales: number;

  @Prop({ required: true, min: 0 })
  totalExpenses: number;

  @Prop({ type: [SaleItem], default: [] })
  sales: SaleItem[];

  @Prop()
  notes?: string;
}

export type DailyRecordDocument = DailyRecord & Document;
export const DailyRecordSchema = SchemaFactory.createForClass(DailyRecord);
