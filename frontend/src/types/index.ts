// User and Authentication Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  INVENTORY_MANAGER = 'inventory_manager',
  DRIVER = 'driver'
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

// Product and Inventory Types
export interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  stockQuantity: number;
  minStockLevel: number;
  barcode?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'in' | 'out';
  quantity: number;
  reason: string;
  carId?: string;
  driverId?: string;
  createdAt: string;
}

// Car and Driver Types
export interface Car {
  id: string;
  plateNumber: string;
  model: string;
  year: number;
  driverId?: string;
  driver?: User;
  assignedProducts: CarProduct[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CarProduct {
  id: string;
  carId: string;
  productId: string;
  product: Product;
  quantity: number;
  assignedAt: string;
}

export interface DailyRecord {
  id: string;
  carId: string;
  driverId: string;
  date: string;
  income: number;
  expenses: number;
  notes?: string;
  createdAt: string;
}

// Finance Types
export interface Expense {
  id: string;
  type: ExpenseType;
  amount: number;
  description: string;
  carId?: {
    _id: string;
    plateNumber: string;
    model: string;
    year: number;
  };
  date: string;
  createdAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
  isActive: boolean;
}

export enum ExpenseType {
  FUEL = 'fuel',
  MAINTENANCE = 'maintenance',
  SALARY = 'salary',
  OTHER = 'other'
}

export interface Income {
  id: string;
  carId: string;
  amount: number;
  date: string;
  createdAt: string;
}

// Dashboard Types
export interface DashboardSummary {
  todayIncome: number;
  todayExpenses: number;
  netProfit: number;
  lowStockProducts: Product[];
  totalProducts: number;
  totalCars: number;
  activeDrivers: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Navigation Types
export type RootStackParamList = {
  Login: undefined;
  Dashboard: undefined;
  Inventory: undefined;
  Cars: undefined;
  Finance: undefined;
  Reports: undefined;
  Users: undefined;
  Settings: undefined;
  ProductDetails: { productId: string };
  CarDetails: { carId: string };
  AddProduct: undefined;
  EditProduct: { productId: string };
  AddCar: undefined;
  EditCar: { carId: string };
  AddExpense: undefined;
  EditExpense: { expenseId: string };
  AddUser: undefined;
  EditUser: { userId: string };
};

// Form Types
export interface ProductFormData {
  name: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  stockQuantity: number;
  minStockLevel: number;
  barcode?: string;
}

export interface CarFormData {
  plateNumber: string;
  model: string;
  year: number;
  driverId?: string;
}

export interface ExpenseFormData {
  type: ExpenseType;
  amount: number;
  description: string;
  carId?: string;
  date: string;
}

// Chart Data Types
export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
    strokeWidth?: number;
  }[];
}

export interface SalesChartData {
  daily: ChartData;
  weekly: ChartData;
  monthly: ChartData;
}

export interface ExpenseChartData {
  byType: ChartData;
  byCar: ChartData;
  trend: ChartData;
}
