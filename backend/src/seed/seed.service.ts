import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Car, CarDocument } from '../cars/schemas/car.schema';
import { Expense, ExpenseDocument } from '../expenses/schemas/expense.schema';
import { UserRole } from '../users/schemas/user.schema';
import { ExpenseType } from '../expenses/schemas/expense.schema';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    @InjectModel(Expense.name) private expenseModel: Model<ExpenseDocument>,
  ) { }

  async seedDatabase() {
    console.log('🌱 Starting database seeding...');

    // Clear existing data
    await this.clearDatabase();

    // Seed users
    const users = await this.seedUsers();
    console.log(`✅ Created ${users.length} users`);

    // Seed products
    const products = await this.seedProducts();
    console.log(`✅ Created ${products.length} products`);

    // Seed cars
    const cars = await this.seedCars(users);
    console.log(`✅ Created ${cars.length} cars`);

    // Seed expenses
    const expenses = await this.seedExpenses(cars as any, users);
    console.log(`✅ Created ${expenses.length} expenses`);

    console.log('🎉 Database seeding completed successfully!');

    return {
      users: users.length,
      products: products.length,
      cars: cars.length,
      expenses: expenses.length,
    };
  }

  private async clearDatabase() {
    await Promise.all([
      this.userModel.deleteMany({}),
      this.productModel.deleteMany({}),
      this.carModel.deleteMany({}),
      this.expenseModel.deleteMany({}),
    ]);
    console.log('🧹 Cleared existing data');
  }

  private async seedUsers() {
    const hashedPassword = await bcrypt.hash('password123', 10);

    const users = [
      {
        email: 'superadmin@mb.com',
        password: hashedPassword,
        name: 'Super Admin',
        role: UserRole.SUPER_ADMIN,
        isActive: true,
      },
      {
        email: 'admin@mb.com',
        password: hashedPassword,
        name: 'John Admin',
        role: UserRole.ADMIN,
        isActive: true,
      },
      {
        email: 'inventory@mb.com',
        password: hashedPassword,
        name: 'Sarah Inventory Manager',
        role: UserRole.INVENTORY_MANAGER,
        isActive: true,
      },
      {
        email: 'driver1@mb.com',
        password: hashedPassword,
        name: 'Mike Driver',
        role: UserRole.DRIVER,
        isActive: true,
      },
      {
        email: 'driver2@mb.com',
        password: hashedPassword,
        name: 'Lisa Driver',
        role: UserRole.DRIVER,
        isActive: true,
      },
      {
        email: 'driver3@mb.com',
        password: hashedPassword,
        name: 'Tom Driver',
        role: UserRole.DRIVER,
        isActive: true,
      },
    ];

    return this.userModel.insertMany(users);
  }

  private async seedProducts() {
    const products = [
      {
        name: 'iPhone 15 Pro Max',
        description: 'Latest iPhone with advanced camera system',
        category: 'Smartphones',
        price: 1199.99,
        cost: 899.99,
        stockQuantity: 25,
        minStockLevel: 5,
        barcode: '1234567890123',
        isActive: true,
      },
      {
        name: 'Samsung Galaxy S24 Ultra',
        description: 'Premium Android smartphone with S Pen',
        category: 'Smartphones',
        price: 1299.99,
        cost: 999.99,
        stockQuantity: 20,
        minStockLevel: 5,
        barcode: '1234567890124',
        isActive: true,
      },
      {
        name: 'AirPods Pro 2nd Gen',
        description: 'Wireless earbuds with noise cancellation',
        category: 'Audio',
        price: 249.99,
        cost: 179.99,
        stockQuantity: 50,
        minStockLevel: 10,
        barcode: '1234567890125',
        isActive: true,
      },
      {
        name: 'Sony WH-1000XM5',
        description: 'Premium noise-canceling headphones',
        category: 'Audio',
        price: 399.99,
        cost: 299.99,
        stockQuantity: 15,
        minStockLevel: 3,
        barcode: '1234567890126',
        isActive: true,
      },
      {
        name: 'MacBook Pro 14" M3',
        description: 'Professional laptop with M3 chip',
        category: 'Laptops',
        price: 1999.99,
        cost: 1499.99,
        stockQuantity: 8,
        minStockLevel: 2,
        barcode: '1234567890127',
        isActive: true,
      },
      {
        name: 'Dell XPS 13',
        description: 'Ultrabook with Intel i7 processor',
        category: 'Laptops',
        price: 1299.99,
        cost: 999.99,
        stockQuantity: 12,
        minStockLevel: 3,
        barcode: '1234567890128',
        isActive: true,
      },
      {
        name: 'iPad Pro 12.9"',
        description: 'Professional tablet with M2 chip',
        category: 'Tablets',
        price: 1099.99,
        cost: 799.99,
        stockQuantity: 18,
        minStockLevel: 4,
        barcode: '1234567890129',
        isActive: true,
      },
      {
        name: 'Samsung Galaxy Tab S9',
        description: 'Android tablet with S Pen included',
        category: 'Tablets',
        price: 799.99,
        cost: 599.99,
        stockQuantity: 22,
        minStockLevel: 5,
        barcode: '1234567890130',
        isActive: true,
      },
      {
        name: 'Apple Watch Series 9',
        description: 'Smartwatch with health monitoring',
        category: 'Wearables',
        price: 399.99,
        cost: 299.99,
        stockQuantity: 30,
        minStockLevel: 8,
        barcode: '1234567890131',
        isActive: true,
      },
      {
        name: 'Samsung Galaxy Watch 6',
        description: 'Android smartwatch with fitness tracking',
        category: 'Wearables',
        price: 299.99,
        cost: 199.99,
        stockQuantity: 25,
        minStockLevel: 6,
        barcode: '1234567890132',
        isActive: true,
      },
      {
        name: 'iPhone Charging Cable',
        description: 'Lightning to USB-C cable 1m',
        category: 'Accessories',
        price: 19.99,
        cost: 9.99,
        stockQuantity: 100,
        minStockLevel: 20,
        barcode: '1234567890133',
        isActive: true,
      },
      {
        name: 'Wireless Charging Pad',
        description: 'Qi-compatible wireless charger',
        category: 'Accessories',
        price: 29.99,
        cost: 15.99,
        stockQuantity: 75,
        minStockLevel: 15,
        barcode: '1234567890134',
        isActive: true,
      },
      {
        name: 'Phone Case iPhone 15',
        description: 'Protective case with MagSafe',
        category: 'Accessories',
        price: 39.99,
        cost: 19.99,
        stockQuantity: 60,
        minStockLevel: 12,
        barcode: '1234567890135',
        isActive: true,
      },
      {
        name: 'Screen Protector Pack',
        description: 'Tempered glass screen protectors (3-pack)',
        category: 'Accessories',
        price: 14.99,
        cost: 6.99,
        stockQuantity: 200,
        minStockLevel: 40,
        barcode: '1234567890136',
        isActive: true,
      },
      {
        name: 'Bluetooth Speaker',
        description: 'Portable speaker with 12-hour battery',
        category: 'Audio',
        price: 79.99,
        cost: 49.99,
        stockQuantity: 40,
        minStockLevel: 8,
        barcode: '1234567890137',
        isActive: true,
      },
    ];

    return this.productModel.insertMany(products);
  }

  private async seedCars(users: UserDocument[]) {
    const admin = users.find(u => u.role === UserRole.ADMIN);
    const drivers = users.filter(u => u.role === UserRole.DRIVER);

    const cars = [
      {
        plateNumber: 'ABC-1234',
        model: 'Toyota Camry',
        year: 2022,
        driverId: drivers[0]._id,
        assignedProducts: [],
        isActive: true,
      },
      {
        plateNumber: 'XYZ-5678',
        model: 'Honda Civic',
        year: 2023,
        driverId: drivers[1]._id,
        assignedProducts: [],
        isActive: true,
      },
      {
        plateNumber: 'DEF-9012',
        model: 'Nissan Altima',
        year: 2021,
        driverId: drivers[2]._id,
        assignedProducts: [],
        isActive: true,
      },
      {
        plateNumber: 'GHI-3456',
        model: 'Hyundai Elantra',
        year: 2023,
        assignedProducts: [],
        isActive: true,
      },
    ];

    return this.carModel.insertMany(cars);
  }

  private async seedExpenses(cars: CarDocument[], users: UserDocument[]) {
    const admin = users.find(u => u.role === UserRole.ADMIN);
    const drivers = users.filter(u => u.role === UserRole.DRIVER);

    const expenses = [
      // Fuel expenses
      {
        type: ExpenseType.FUEL,
        amount: 45.50,
        description: 'Gas station fill-up',
        carId: cars[0]._id,
        date: new Date('2024-01-15'),
        createdBy: drivers[0]._id,
      },
      {
        type: ExpenseType.FUEL,
        amount: 52.30,
        description: 'Gas station fill-up',
        carId: cars[1]._id,
        date: new Date('2024-01-16'),
        createdBy: drivers[1]._id,
      },
      {
        type: ExpenseType.FUEL,
        amount: 38.75,
        description: 'Gas station fill-up',
        carId: cars[2]._id,
        date: new Date('2024-01-17'),
        createdBy: drivers[2]._id,
      },

      // Maintenance expenses
      {
        type: ExpenseType.MAINTENANCE,
        amount: 120.00,
        description: 'Oil change and filter replacement',
        carId: cars[0]._id,
        date: new Date('2024-01-10'),
        createdBy: admin!._id,
      },
      {
        type: ExpenseType.MAINTENANCE,
        amount: 85.50,
        description: 'Brake pad replacement',
        carId: cars[1]._id,
        date: new Date('2024-01-12'),
        createdBy: admin!._id,
      },
      {
        type: ExpenseType.MAINTENANCE,
        amount: 200.00,
        description: 'Tire replacement (2 tires)',
        carId: cars[2]._id,
        date: new Date('2024-01-14'),
        createdBy: admin!._id,
      },

      // Salary expenses
      {
        type: ExpenseType.SALARY,
        amount: 2500.00,
        description: 'Monthly salary - Mike Driver',
        date: new Date('2024-01-01'),
        createdBy: admin!._id,
      },
      {
        type: ExpenseType.SALARY,
        amount: 2500.00,
        description: 'Monthly salary - Lisa Driver',
        date: new Date('2024-01-01'),
        createdBy: admin!._id,
      },
      {
        type: ExpenseType.SALARY,
        amount: 2500.00,
        description: 'Monthly salary - Tom Driver',
        date: new Date('2024-01-01'),
        createdBy: admin!._id,
      },
      {
        type: ExpenseType.SALARY,
        amount: 4000.00,
        description: 'Monthly salary - Sarah Inventory Manager',
        date: new Date('2024-01-01'),
        createdBy: admin!._id,
      },

      // Other expenses
      {
        type: ExpenseType.OTHER,
        amount: 150.00,
        description: 'Office supplies and equipment',
        date: new Date('2024-01-05'),
        createdBy: admin!._id,
      },
      {
        type: ExpenseType.OTHER,
        amount: 75.00,
        description: 'Marketing materials',
        date: new Date('2024-01-08'),
        createdBy: admin!._id,
      },
      {
        type: ExpenseType.OTHER,
        amount: 300.00,
        description: 'Insurance premium',
        date: new Date('2024-01-01'),
        createdBy: admin!._id,
      },
    ];

    return this.expenseModel.insertMany(expenses);
  }

  async assignProductsToCars() {
    const cars = await this.carModel.find({ isActive: true });
    const products = await this.productModel.find({ isActive: true });

    // Assign random products to each car
    for (const car of cars) {
      const randomProducts = this.getRandomProducts(products, 3, 8);

      car.assignedProducts = randomProducts.map(product => ({
        productId: product._id as any,
        quantity: Math.floor(Math.random() * 10) + 1,
        assignedAt: new Date(),
      }));

      await car.save();
    }

    console.log('✅ Assigned products to cars');
  }

  private getRandomProducts(products: ProductDocument[], min: number, max: number) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
