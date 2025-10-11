import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Car, CarDocument } from './schemas/car.schema';
import {
  DailyRecord,
  DailyRecordDocument,
} from './schemas/daily-record.schema';
import {
  CreateCarDto,
  UpdateCarDto,
  AssignProductDto,
  DailyRecordDto,
} from './dto/car.dto';

@Injectable()
export class CarsService {
  constructor(
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    @InjectModel(DailyRecord.name)
    private dailyRecordModel: Model<DailyRecordDocument>,
  ) {}

  async create(createCarDto: CreateCarDto): Promise<Car> {
    const existingCar = await this.carModel.findOne({
      plateNumber: createCarDto.plateNumber,
    });

    if (existingCar) {
      throw new BadRequestException(
        'Car with this plate number already exists',
      );
    }

    const car = new this.carModel(createCarDto);
    return (car as any).save();
  }

  async findAll(): Promise<Car[]> {
    return this.carModel
      .find({ isActive: true })
      .populate('driver', 'name email role')
      .populate('assignedProducts.productId', 'name price')
      .exec();
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carModel
      .findById(id)
      .populate('driver', 'name email role')

      .populate('assignedProducts.productId', 'name price description')

      .exec();

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  async update(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
    const car = await this.carModel
      .findByIdAndUpdate(id, updateCarDto, { new: true })
      .populate('driver', 'name email role')

      .populate('assignedProducts.productId', 'name price')

      .exec();

    if (!car) {
      throw new NotFoundException('Car not found');
    }

    return car;
  }

  async remove(id: string): Promise<void> {
    const result = await this.carModel
      .findByIdAndUpdate(id, { isActive: false }, { new: true })
      .exec();

    if (!result) {
      throw new NotFoundException('Car not found');
    }
  }

  async assignProduct(
    carId: string,
    assignProductDto: AssignProductDto,
  ): Promise<Car> {
    const car = await this.findOne(carId);

    // Check if product is already assigned
    const existingAssignment = car.assignedProducts.find(
      (assignment) =>
        assignment.productId.toString() === assignProductDto.productId,
    );

    if (existingAssignment) {
      existingAssignment.quantity += assignProductDto.quantity;
    } else {
      car.assignedProducts.push({
        productId: new Types.ObjectId(assignProductDto.productId),
        quantity: assignProductDto.quantity,
        assignedAt: new Date(),
      });
    }

    return (car as any).save();
  }

  async removeProduct(carId: string, productId: string): Promise<Car> {
    const car = await this.findOne(carId);

    car.assignedProducts = car.assignedProducts.filter(
      (assignment) => assignment.productId.toString() !== productId,
    );

    return (car as any).save();
  }

  async updateProductQuantity(
    carId: string,
    productId: string,
    quantity: number,
  ): Promise<Car> {
    const car = await this.findOne(carId);

    const assignment = car.assignedProducts.find(
      (assignment) => assignment.productId.toString() === productId,
    );

    if (!assignment) {
      throw new NotFoundException('Product not assigned to this car');
    }

    assignment.quantity = quantity;
    return (car as any).save();
  }

  async getCarsByDriver(driverId: string): Promise<Car[]> {
    return this.carModel
      .find({ driverId, isActive: true })
      .populate('assignedProducts.productId', 'name price')
      .exec();
  }

  async getUnassignedCars(): Promise<Car[]> {
    return this.carModel
      .find({ driverId: { $exists: false }, isActive: true })
      .exec();
  }

  async getTotalCarsCount(): Promise<number> {
    return this.carModel.countDocuments({ isActive: true }).exec();
  }

  async getAssignedCarsCount(): Promise<number> {
    return this.carModel
      .countDocuments({
        driverId: { $exists: true },
        isActive: true,
      })
      .exec();
  }

  async getUnassignedCarsCount(): Promise<number> {
    return this.carModel
      .countDocuments({
        driverId: { $exists: false },
        isActive: true,
      })
      .exec();
  }

  async createDailyRecord(
    dailyRecordDto: DailyRecordDto,
  ): Promise<DailyRecord> {
    const dailyRecord = new this.dailyRecordModel({
      ...dailyRecordDto,
      date: new Date(dailyRecordDto.date), // Convert date string to Date object
      car: new Types.ObjectId(dailyRecordDto.car),
      driverId: new Types.ObjectId(dailyRecordDto.driver),
      sales: dailyRecordDto.sales.map((saleItem) => ({
        ...saleItem,
        productId: new Types.ObjectId(saleItem.productId),
      })),
    });
    return dailyRecord.save();
  }
}
