import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto, UpdateProductDto, StockMovementDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    const product = new this.productModel(createProductDto);
    return product.save();
  }

  async findAll(page: number = 1, limit: number = 10, search?: string): Promise<{
    data: Product[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const query: any = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { barcode: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.productModel.find(query).skip(skip).limit(limit).exec(),
      this.productModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.productModel.findById(id).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async findByBarcode(barcode: string): Promise<Product> {
    const product = await this.productModel.findOne({ barcode, isActive: true }).exec();
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async remove(id: string): Promise<void> {
    const result = await this.productModel.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    ).exec();

    if (!result) {
      throw new NotFoundException('Product not found');
    }
  }

  async updateStock(id: string, stockMovementDto: StockMovementDto): Promise<Product> {
    const product = await this.findOne(id);
    
    if (stockMovementDto.type === 'out' && product.stockQuantity < stockMovementDto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    const newStockQuantity = stockMovementDto.type === 'in' 
      ? product.stockQuantity + stockMovementDto.quantity
      : product.stockQuantity - stockMovementDto.quantity;

    return this.update(id, { stockQuantity: newStockQuantity });
  }

  async getLowStockProducts(): Promise<Product[]> {
    return this.productModel.find({
      isActive: true,
      $expr: { $lte: ['$stockQuantity', '$minStockLevel'] }
    }).exec();
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return this.productModel.find({ category, isActive: true }).exec();
  }

  async getTotalProductsCount(): Promise<number> {
    return this.productModel.countDocuments({ isActive: true }).exec();
  }

  async getCategories(): Promise<string[]> {
    return this.productModel.distinct('category', { isActive: true }).exec();
  }
}
