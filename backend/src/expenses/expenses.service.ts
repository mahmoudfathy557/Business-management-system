import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Expense, ExpenseDocument } from './schemas/expense.schema';
import { CreateExpenseDto, UpdateExpenseDto, ExpenseReportDto } from './dto/expense.dto';

@Injectable()
export class ExpensesService {
  constructor(
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
  ) {}

  async create(createExpenseDto: CreateExpenseDto, userId: string): Promise<Expense> {
    const expense = new this.expenseModel({
      ...createExpenseDto,
      createdBy: new Types.ObjectId(userId),
    });
    return expense.save();
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    carId?: string,
  ): Promise<{
    data: Expense[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const query: any = {};
    
    if (carId) {
      query.carId = new Types.ObjectId(carId);
    }

    const skip = (page - 1) * limit;
    const [data, total] = await Promise.all([
      this.expenseModel
        .find(query)
        .populate('carId', 'plateNumber model')
        .populate('createdBy', 'name email')
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.expenseModel.countDocuments(query).exec(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Expense> {
    const expense = await this.expenseModel
      .findById(id)
      .populate('carId', 'plateNumber model')
      .populate('createdBy', 'name email')
      .exec();

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto): Promise<Expense> {
    const expense = await this.expenseModel
      .findByIdAndUpdate(id, updateExpenseDto, { new: true })
      .populate('carId', 'plateNumber model')
      .populate('createdBy', 'name email')
      .exec();

    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    return expense;
  }

  async remove(id: string): Promise<void> {
    const result = await this.expenseModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException('Expense not found');
    }
  }

  async getExpensesByDateRange(
    startDate: string,
    endDate: string,
    carId?: string,
  ): Promise<Expense[]> {
    const query: any = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    if (carId) {
      query.carId = new Types.ObjectId(carId);
    }

    return this.expenseModel
      .find(query)
      .populate('carId', 'plateNumber model')
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .exec();
  }

  async getExpensesByType(
    type: string,
    startDate?: string,
    endDate?: string,
  ): Promise<Expense[]> {
    const query: any = { type };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    return this.expenseModel
      .find(query)
      .populate('carId', 'plateNumber model')
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .exec();
  }

  async getTotalExpenses(
    startDate?: string,
    endDate?: string,
    carId?: string,
  ): Promise<number> {
    const query: any = {};

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (carId) {
      query.carId = new Types.ObjectId(carId);
    }

    const result = await this.expenseModel.aggregate([
      { $match: query },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    return result.length > 0 ? result[0].total : 0;
  }

  async getExpensesByTypeReport(
    startDate: string,
    endDate: string,
    carId?: string,
  ): Promise<any[]> {
    const matchQuery: any = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    if (carId) {
      matchQuery.carId = new Types.ObjectId(carId);
    }

    return this.expenseModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);
  }

  async getExpensesByCarReport(
    startDate: string,
    endDate: string,
  ): Promise<any[]> {
    return this.expenseModel.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
          carId: { $exists: true },
        },
      },
      {
        $lookup: {
          from: 'cars',
          localField: 'carId',
          foreignField: '_id',
          as: 'car',
        },
      },
      { $unwind: '$car' },
      {
        $group: {
          _id: '$carId',
          carPlateNumber: { $first: '$car.plateNumber' },
          carModel: { $first: '$car.model' },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]);
  }

  async getMonthlyExpenseTrend(
    startDate: string,
    endDate: string,
    carId?: string,
  ): Promise<any[]> {
    const matchQuery: any = {
      date: {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      },
    };

    if (carId) {
      matchQuery.carId = new Types.ObjectId(carId);
    }

    return this.expenseModel.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
  }
}
