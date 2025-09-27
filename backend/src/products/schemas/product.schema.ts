import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  category: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ required: true, min: 0 })
  cost: number;

  @Prop({ required: true, min: 0, default: 0 })
  stockQuantity: number;

  @Prop({ required: true, min: 0, default: 5 })
  minStockLevel: number;

  @Prop()
  barcode?: string;

  @Prop()
  imageUrl?: string;

  @Prop({ default: true })
  isActive: boolean;
}

export type ProductDocument = Product & Document;
export const ProductSchema = SchemaFactory.createForClass(Product);
