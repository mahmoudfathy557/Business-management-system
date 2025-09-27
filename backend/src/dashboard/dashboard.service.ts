import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { CarsService } from '../cars/cars.service';
import { ExpensesService } from '../expenses/expenses.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class DashboardService {
  constructor(
    private productsService: ProductsService,
    private carsService: CarsService,
    private expensesService: ExpensesService,
    private usersService: UsersService,
  ) {}

  async getDashboardSummary() {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    const [
      lowStockProducts,
      totalProducts,
      totalCars,
      activeDrivers,
      todayExpenses,
    ] = await Promise.all([
      this.productsService.getLowStockProducts(),
      this.productsService.getTotalProductsCount(),
      this.carsService.getTotalCarsCount(),
      this.usersService.getUsersByRole('driver'),
      this.expensesService.getTotalExpenses(
        startOfDay.toISOString().split('T')[0],
        endOfDay.toISOString().split('T')[0],
      ),
    ]);

    // Mock today's income - in a real app, this would come from sales data
    const todayIncome = 2500; // This should be calculated from actual sales

    return {
      todayIncome,
      todayExpenses,
      netProfit: todayIncome - todayExpenses,
      lowStockProducts,
      totalProducts,
      totalCars,
      activeDrivers: activeDrivers.length,
    };
  }

  async getSalesReport(startDate: string, endDate: string, carId?: string) {
    // Mock sales data - in a real app, this would come from actual sales records
    const mockSalesData = [
      { date: '2024-01-01', amount: 1200, carId: carId || 'car1' },
      { date: '2024-01-02', amount: 1500, carId: carId || 'car2' },
      { date: '2024-01-03', amount: 1800, carId: carId || 'car1' },
      { date: '2024-01-04', amount: 1400, carId: carId || 'car3' },
      { date: '2024-01-05', amount: 2000, carId: carId || 'car2' },
    ];

    return {
      data: mockSalesData,
      total: mockSalesData.reduce((sum, sale) => sum + sale.amount, 0),
      average: mockSalesData.reduce((sum, sale) => sum + sale.amount, 0) / mockSalesData.length,
    };
  }

  async getExpenseReport(startDate: string, endDate: string, carId?: string) {
    return this.expensesService.getExpensesByDateRange(startDate, endDate, carId);
  }

  async getProfitReport(startDate: string, endDate: string, carId?: string) {
    const [salesData, expensesData] = await Promise.all([
      this.getSalesReport(startDate, endDate, carId),
      this.expensesService.getExpensesByDateRange(startDate, endDate, carId),
    ]);

    const totalIncome = salesData.total;
    const totalExpenses = expensesData.reduce((sum, expense) => sum + expense.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    return {
      totalIncome,
      totalExpenses,
      netProfit,
      profitMargin: totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0,
      salesData: salesData.data,
      expensesData,
    };
  }

  async getInventorySummary() {
    const [totalProducts, lowStockProducts, categories] = await Promise.all([
      this.productsService.getTotalProductsCount(),
      this.productsService.getLowStockProducts(),
      this.productsService.getCategories(),
    ]);

    return {
      totalProducts,
      lowStockCount: lowStockProducts.length,
      categories: categories.length,
      lowStockProducts: lowStockProducts.slice(0, 5), // Top 5 low stock products
    };
  }

  async getCarPerformance(startDate: string, endDate: string) {
    const cars = await this.carsService.findAll();
    const expensesByCar = await this.expensesService.getExpensesByCarReport(startDate, endDate);
    
    // Mock sales data for cars
    const mockSalesData = cars.map(car => ({
      carId: (car as any)._id,
      plateNumber: car.plateNumber,
      model: car.model,
      sales: Math.floor(Math.random() * 5000) + 1000, // Random sales between 1000-6000
    }));

    return cars.map(car => {
      const carExpenses = expensesByCar.find(exp => exp._id.toString() === (car as any)._id.toString());
      const carSales = mockSalesData.find(sale => sale.carId.toString() === (car as any)._id.toString());
      
      return {
        carId: (car as any)._id,
        plateNumber: car.plateNumber,
        model: car.model,
        driver: car.driverId,
        sales: carSales?.sales || 0,
        expenses: carExpenses?.total || 0,
        profit: (carSales?.sales || 0) - (carExpenses?.total || 0),
        assignedProducts: car.assignedProducts.length,
      };
    });
  }

  async getFinancialSummary(startDate: string, endDate: string) {
    const [expensesByType, expensesByCar, monthlyTrend] = await Promise.all([
      this.expensesService.getExpensesByTypeReport(startDate, endDate),
      this.expensesService.getExpensesByCarReport(startDate, endDate),
      this.expensesService.getMonthlyExpenseTrend(startDate, endDate),
    ]);

    const totalExpenses = expensesByType.reduce((sum, item) => sum + item.total, 0);

    return {
      totalExpenses,
      expensesByType,
      expensesByCar,
      monthlyTrend,
      averageDailyExpense: totalExpenses / this.getDaysBetween(startDate, endDate),
    };
  }

  private getDaysBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}
