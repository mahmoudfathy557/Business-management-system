import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class CarProduct {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  quantity: number;

  @Prop({ default: Date.now })
  assignedAt: Date;
}

@Schema({ timestamps: true })
export class Car {
  @Prop({ required: true, unique: true })
  plateNumber: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true, min: 1900, max: new Date().getFullYear() + 1 })
  year: number;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  driverId?: Types.ObjectId;

  @Prop({ type: [CarProduct], default: [] })
  assignedProducts: CarProduct[];

  @Prop({ default: true })
  isActive: boolean;
}

export type CarDocument = Car & Document;
export const CarSchema = SchemaFactory.createForClass(Car);
