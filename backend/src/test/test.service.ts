import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Car, CarDocument } from '../cars/schemas/car.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Expense, ExpenseDocument } from '../expenses/schemas/expense.schema';
import {
  DailyRecord,
  DailyRecordDocument,
} from '../cars/schemas/daily-record.schema';

@Injectable()
export class TestService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
    @InjectModel(DailyRecord.name)
    private dailyRecordModel: Model<DailyRecordDocument>,
  ) {}

  async getComprehensiveTestData(includeInactive: boolean = false) {
    try {
      // Get all entities with their relationships
      const [users, cars, products, expenses, dailyRecords] = await Promise.all(
        [
          this.getUsersWithRelations(includeInactive),
          this.getCarsWithRelations(includeInactive),
          this.getProductsWithRelations(),
          this.getExpensesWithRelations(),
          this.getDailyRecordsWithRelations(),
        ],
      );

      // Calculate comprehensive relationships
      const relationships = await this.calculateRelationships(
        users,
        cars,
        products,
        expenses,
        dailyRecords,
      );

      // Calculate summary statistics
      const summary = {
        totalUsers: users.length,
        totalCars: cars.length,
        totalProducts: products.length,
        totalExpenses: expenses.length,
        totalDailyRecords: dailyRecords.length,
        activeUsers: users.filter((u) => u.isActive).length,
        activeCars: cars.filter((c) => c.isActive).length,
        lowStockProducts: products.filter(
          (p) => (p as any).currentStock <= (p as any).minStock,
        ).length,
        totalExpenseAmount: expenses.reduce((sum, e) => sum + e.amount, 0),
        totalSalesAmount: dailyRecords.reduce(
          (sum, d) => sum + (d as any).totalSales,
          0,
        ),
      };

      return {
        summary,
        users: users.map((user) => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          assignedCars: (user as any).assignedCars || [],
          totalExpenses: (user as any).totalExpenses || 0,
          totalSales: (user as any).totalSales || 0,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
        })),
        cars: cars.map((car) => ({
          _id: car._id,
          plateNumber: car.plateNumber,
          model: car.model,
          year: car.year,
          isActive: car.isActive,
          driver: car.driver
            ? {
                _id: (car.driver as any)._id,
                name: (car.driver as any).name,
                email: (car.driver as any).email,
                role: (car.driver as any).role,
              }
            : null,
          assignedProducts: car.assignedProducts || [],
          dailyRecords: (car as any).dailyRecords || [],
          totalSales: (car as any).totalSales || 0,
          totalExpenses: (car as any).totalExpenses || 0,
          profit:
            ((car as any).totalSales || 0) - ((car as any).totalExpenses || 0),
          createdAt: (car as any).createdAt,
        })),
        products: products.map((product) => ({
          _id: product._id,
          name: product.name,
          category: product.category,
          currentStock: (product as any).currentStock,
          minStock: (product as any).minStock,
          price: product.price,
          assignedToCars: (product as any).assignedToCars || [],
          totalSold: (product as any).totalSold || 0,
          totalRevenue: ((product as any).totalSold || 0) * product.price,
          createdAt: (product as any).createdAt,
        })),
        relationships,
        metadata: {
          generatedAt: new Date(),
          includeInactive,
          dataIntegrity: await this.checkDataIntegrity(),
        },
      };
    } catch (error) {
      throw new Error(
        `Failed to get comprehensive test data: ${error.message}`,
      );
    }
  }

  private async getUsersWithRelations(includeInactive: boolean) {
    const query = includeInactive ? {} : { isActive: true };

    const users = await this.userModel
      .find(query)
      .populate('assignedCars', 'plateNumber model year')
      .lean();

    // Calculate user statistics
    for (const user of users) {
      const [totalExpenses, totalSales] = await Promise.all([
        this.expenseModel.aggregate([
          { $match: { userId: user._id } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        this.dailyRecordModel.aggregate([
          { $match: { driver: user._id } },
          { $group: { _id: null, total: { $sum: '$totalSales' } } },
        ]),
      ]);

      (user as any).totalExpenses = totalExpenses[0]?.total || 0;
      (user as any).totalSales = totalSales[0]?.total || 0;
    }

    return users;
  }

  private async getCarsWithRelations(includeInactive: boolean) {
    const query = includeInactive ? {} : { isActive: true };

    const cars = await this.carModel
      .find(query)
      .populate('driver', 'name email role')
      .populate('assignedProducts.productId', 'name category price')
      .lean();

    // Calculate car statistics
    for (const car of cars) {
      const [totalExpenses, dailyRecords] = await Promise.all([
        this.expenseModel.aggregate([
          { $match: { carId: car._id } },
          { $group: { _id: null, total: { $sum: '$amount' } } },
        ]),
        this.dailyRecordModel.find({ carId: car._id }).lean(),
      ]);

      const totalSales = dailyRecords.reduce(
        (sum, record) => sum + (record as any).totalSales,
        0,
      );

      (car as any).totalExpenses = totalExpenses[0]?.total || 0;
      (car as any).totalSales = totalSales;
      (car as any).dailyRecords = dailyRecords;
    }

    return cars;
  }

  private async getProductsWithRelations() {
    const products = await this.productModel.find().lean();

    // Calculate product statistics
    for (const product of products) {
      const [assignedToCars, totalSold] = await Promise.all([
        this.carModel
          .find(
            { 'assignedProducts.productId': product._id },
            'plateNumber model',
          )
          .lean(),
        this.dailyRecordModel.aggregate([
          { $unwind: '$sales' },
          { $match: { 'sales.productId': product._id } },
          { $group: { _id: null, total: { $sum: '$sales.quantity' } } },
        ]),
      ]);

      (product as any).assignedToCars = assignedToCars;
      (product as any).totalSold = totalSold[0]?.total || 0;
    }

    return products;
  }

  private async getExpensesWithRelations() {
    return this.expenseModel
      .find()
      .populate('userId', 'name email role')
      .populate('carId', 'plateNumber model')
      .lean();
  }

  private async getDailyRecordsWithRelations() {
    return this.dailyRecordModel
      .find()
      .populate('carId', 'plateNumber model')
      .populate('driver', 'name email')
      .populate('sales.productId', 'name category price')
      .lean();
  }

  private async calculateRelationships(
    users,
    cars,
    products,
    expenses,
    dailyRecords,
  ) {
    // User-Car assignments
    const userCarAssignments = users.map((user) => ({
      userId: user._id,
      userName: user.name,
      userRole: user.role,
      assignedCars: user.assignedCars || [],
      totalCarsAssigned: (user.assignedCars || []).length,
    }));

    // Car-Product assignments
    const carProductAssignments = cars.map((car) => ({
      carId: car._id,
      plateNumber: car.plateNumber,
      assignedProducts: car.assignedProducts || [],
      totalProductsAssigned: (car.assignedProducts || []).length,
      totalProductValue: (car.assignedProducts || []).reduce((sum, ap) => {
        const product = products.find(
          (p) => p._id.toString() === ap.productId?.toString(),
        );
        return sum + (product?.price || 0) * ap.quantity;
      }, 0),
    }));

    // Expense-User relations
    const expenseUserRelations = expenses.map((expense) => ({
      expenseId: expense._id,
      amount: expense.amount,
      type: expense.type,
      userId: expense.userId?._id,
      userName: expense.userId?.name,
      carId: expense.carId?._id,
      carPlate: expense.carId?.plateNumber,
      date: expense.date,
    }));

    // Daily Record relations
    const dailyRecordRelations = dailyRecords.map((record) => ({
      recordId: record._id,
      date: record.date,
      carId: record.carId?._id,
      carPlate: record.carId?.plateNumber,
      driver: record.driver?._id,
      driverName: record.driver?.name,
      totalSales: record.totalSales,
      totalExpenses: record.totalExpenses,
      salesCount: record.sales?.length || 0,
    }));

    return {
      userCarAssignments,
      carProductAssignments,
      expenseUserRelations,
      dailyRecordRelations,
      summary: {
        totalUserCarAssignments: userCarAssignments.length,
        totalCarProductAssignments: carProductAssignments.length,
        totalExpenseUserRelations: expenseUserRelations.length,
        totalDailyRecordRelations: dailyRecordRelations.length,
      },
    };
  }

  async testRelationshipIntegrity() {
    const integrityCheck: any = {
      orphanedRecords: {},
      missingReferences: {},
      dataConsistency: {},
    };

    const recommendations: string[] = [];

    try {
      // Check for orphaned expenses (expenses without valid user or car)
      const orphanedExpenses = await this.expenseModel
        .find({
          $or: [{ userId: { $exists: false } }, { carId: { $exists: false } }],
        })
        .lean();

      if (orphanedExpenses.length > 0) {
        integrityCheck.orphanedRecords.orphanedExpenses =
          orphanedExpenses.length;
        recommendations.push(
          `Found ${orphanedExpenses.length} orphaned expenses. Consider cleaning up or reassigning.`,
        );
      }

      // Check for cars without drivers
      const carsWithoutDrivers = await this.carModel
        .find({
          driver: { $exists: false },
        })
        .lean();

      if (carsWithoutDrivers.length > 0) {
        integrityCheck.orphanedRecords.carsWithoutDrivers =
          carsWithoutDrivers.length;
        recommendations.push(
          `Found ${carsWithoutDrivers.length} cars without assigned drivers.`,
        );
      }

      // Check for products with negative stock
      const negativeStockProducts = await this.productModel
        .find({
          currentStock: { $lt: 0 },
        })
        .lean();

      if (negativeStockProducts.length > 0) {
        integrityCheck.dataConsistency.negativeStockProducts =
          negativeStockProducts.length;
        recommendations.push(
          `Found ${negativeStockProducts.length} products with negative stock.`,
        );
      }

      // Check for daily records without valid car or driver
      const invalidDailyRecords = await this.dailyRecordModel
        .find({
          $or: [{ carId: { $exists: false } }, { driver: { $exists: false } }],
        })
        .lean();

      if (invalidDailyRecords.length > 0) {
        integrityCheck.orphanedRecords.invalidDailyRecords =
          invalidDailyRecords.length;
        recommendations.push(
          `Found ${invalidDailyRecords.length} daily records with missing car or driver references.`,
        );
      }

      // Check for users with invalid roles
      const invalidRoleUsers = await this.userModel
        .find({
          role: {
            $nin: ['super_admin', 'admin', 'inventory_manager', 'driver'],
          },
        })
        .lean();

      if (invalidRoleUsers.length > 0) {
        integrityCheck.dataConsistency.invalidRoleUsers =
          invalidRoleUsers.length;
        recommendations.push(
          `Found ${invalidRoleUsers.length} users with invalid roles.`,
        );
      }

      return {
        integrityCheck,
        recommendations,
        status: recommendations.length === 0 ? 'HEALTHY' : 'ISSUES_FOUND',
        checkedAt: new Date(),
      };
    } catch (error) {
      throw new Error(`Relationship integrity check failed: ${error.message}`);
    }
  }

  async getPerformanceMetrics() {
    try {
      // Top performing cars by sales
      const topPerformingCars = await this.dailyRecordModel.aggregate([
        {
          $group: {
            _id: '$carId',
            totalSales: { $sum: '$totalSales' },
            totalExpenses: { $sum: '$totalExpenses' },
            recordCount: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: 'cars',
            localField: '_id',
            foreignField: '_id',
            as: 'car',
          },
        },
        {
          $unwind: '$car',
        },
        {
          $addFields: {
            profit: { $subtract: ['$totalSales', '$totalExpenses'] },
            averageDailySales: { $divide: ['$totalSales', '$recordCount'] },
          },
        },
        {
          $sort: { totalSales: -1 },
        },
        {
          $limit: 5,
        },
      ]);

      // Top selling products
      const topSellingProducts = await this.dailyRecordModel.aggregate([
        { $unwind: '$sales' },
        {
          $group: {
            _id: '$sales.productId',
            totalQuantity: { $sum: '$sales.quantity' },
            totalRevenue: {
              $sum: { $multiply: ['$sales.quantity', '$sales.price'] },
            },
          },
        },
        {
          $lookup: {
            from: 'products',
            localField: '_id',
            foreignField: '_id',
            as: 'product',
          },
        },
        {
          $unwind: '$product',
        },
        {
          $sort: { totalQuantity: -1 },
        },
        {
          $limit: 10,
        },
      ]);

      // Most active users
      const mostActiveUsers = await this.dailyRecordModel.aggregate([
        {
          $group: {
            _id: '$driver',
            totalRecords: { $sum: 1 },
            totalSales: { $sum: '$totalSales' },
            totalExpenses: { $sum: '$totalExpenses' },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $sort: { totalRecords: -1 },
        },
        {
          $limit: 5,
        },
      ]);

      // Expense breakdown by type
      const expenseBreakdown = await this.expenseModel.aggregate([
        {
          $group: {
            _id: '$type',
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 },
            averageAmount: { $avg: '$amount' },
          },
        },
        {
          $sort: { totalAmount: -1 },
        },
      ]);

      // Sales trends (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const salesTrends = await this.dailyRecordModel.aggregate([
        {
          $match: {
            date: { $gte: thirtyDaysAgo },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: '$date' },
              month: { $month: '$date' },
              day: { $dayOfMonth: '$date' },
            },
            dailySales: { $sum: '$totalSales' },
            dailyExpenses: { $sum: '$totalExpenses' },
            recordCount: { $sum: 1 },
          },
        },
        {
          $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 },
        },
      ]);

      return {
        topPerformingCars,
        topSellingProducts,
        mostActiveUsers,
        expenseBreakdown,
        salesTrends,
        generatedAt: new Date(),
        period: 'Last 30 days for trends, all time for other metrics',
      };
    } catch (error) {
      throw new Error(`Failed to get performance metrics: ${error.message}`);
    }
  }

  private async checkDataIntegrity() {
    const checks = {
      usersWithValidRoles: 0,
      carsWithDrivers: 0,
      productsWithValidStock: 0,
      expensesWithValidReferences: 0,
      dailyRecordsWithValidReferences: 0,
    };

    try {
      const [
        userCount,
        carCount,
        productCount,
        expenseCount,
        dailyRecordCount,
      ] = await Promise.all([
        this.userModel.countDocuments({
          role: {
            $in: ['super_admin', 'admin', 'inventory_manager', 'driver'],
          },
        }),
        this.carModel.countDocuments({ driver: { $exists: true } }),
        this.productModel.countDocuments({ currentStock: { $gte: 0 } }),
        this.expenseModel.countDocuments({
          userId: { $exists: true },
          carId: { $exists: true },
        }),
        this.dailyRecordModel.countDocuments({
          carId: { $exists: true },
          driver: { $exists: true },
        }),
      ]);

      checks.usersWithValidRoles = userCount;
      checks.carsWithDrivers = carCount;
      checks.productsWithValidStock = productCount;
      checks.expensesWithValidReferences = expenseCount;
      checks.dailyRecordsWithValidReferences = dailyRecordCount;

      return checks;
    } catch (error) {
      return { error: error.message };
    }
  }
}
