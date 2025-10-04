import axios, { AxiosInstance, AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  LoginCredentials,
  RegisterData,
  Product,
  Car,
  Expense,
  DailyRecord,
  DashboardSummary,
  ApiResponse,
  PaginatedResponse,
  ProductFormData,
  CarFormData,
  ExpenseFormData,
  StockMovement
} from '../types';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string = 'http://192.168.1.8:3000/api'; // Your local network IP address

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          await AsyncStorage.removeItem('authToken');
          await AsyncStorage.removeItem('user');
          // You might want to redirect to login here
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication APIs
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> =
      await this.api.post('/auth/login', credentials);
    return response.data.data;
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> =
      await this.api.post('/auth/register', data);
    return response.data.data;
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.get('/auth/profile');
    return response.data.data;
  }

  // Product APIs
  async getProducts(page: number = 1, limit: number = 10, search?: string): Promise<PaginatedResponse<Product>> {
    const params = { page, limit, ...(search && { search }) };
    const response: AxiosResponse<PaginatedResponse<Product>> =
      await this.api.get('/products', { params });
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.api.get(`/products/${id}`);
    return response.data.data;
  }

  async createProduct(data: ProductFormData): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> =
      await this.api.post('/products', data);
    return response.data.data;
  }

  async updateProduct(id: string, data: Partial<ProductFormData>): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> =
      await this.api.put(`/products/${id}`, data);
    return response.data.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.api.delete(`/products/${id}`);
  }

  async updateStock(productId: string, quantity: number, type: 'in' | 'out', reason: string): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> =
      await this.api.post(`/products/${productId}/stock`, { quantity, type, reason });
    return response.data.data;
  }

  async getStockMovements(productId: string): Promise<StockMovement[]> {
    const response: AxiosResponse<ApiResponse<StockMovement[]>> =
      await this.api.get(`/products/${productId}/stock-movements`);
    return response.data.data;
  }

  // Car APIs
  async getCars(): Promise<Car[]> {
    const response: AxiosResponse<ApiResponse<Car[]>> = await this.api.get('/cars');
    return response.data.data;
  }

  async getCar(id: string): Promise<Car> {
    const response: AxiosResponse<ApiResponse<Car>> = await this.api.get(`/cars/${id}`);
    return response.data.data;
  }

  async createCar(data: CarFormData): Promise<Car> {
    const response: AxiosResponse<ApiResponse<Car>> = await this.api.post('/cars', data);
    return response.data.data;
  }

  async updateCar(id: string, data: Partial<CarFormData>): Promise<Car> {
    const response: AxiosResponse<ApiResponse<Car>> = await this.api.put(`/cars/${id}`, data);
    return response.data.data;
  }

  async deleteCar(id: string): Promise<void> {
    await this.api.delete(`/cars/${id}`);
  }

  async assignProductToCar(carId: string, productId: string, quantity: number): Promise<void> {
    await this.api.post(`/cars/${carId}/products`, { productId, quantity });
  }

  async removeProductFromCar(carId: string, productId: string): Promise<void> {
    await this.api.delete(`/cars/${carId}/products/${productId}`);
  }

  // Daily Records APIs
  async createDailyRecord(data: { carId: string; income: number; expenses: number; notes?: string }): Promise<DailyRecord> {
    const response: AxiosResponse<ApiResponse<DailyRecord>> =
      await this.api.post('/daily-records', data);
    return response.data.data;
  }

  async getDailyRecords(carId?: string, startDate?: string, endDate?: string): Promise<DailyRecord[]> {
    const params = { ...(carId && { carId }), ...(startDate && { startDate }), ...(endDate && { endDate }) };
    const response: AxiosResponse<ApiResponse<DailyRecord[]>> =
      await this.api.get('/daily-records', { params });
    return response.data.data;
  }

  // Expense APIs
  async getExpenses(page: number = 1, limit: number = 10, period?: string): Promise<PaginatedResponse<Expense>> {
    const params = { page, limit, ...(period && { period }) };
    const response: AxiosResponse<PaginatedResponse<Expense>> =
      await this.api.get('/expenses', { params });
    return response.data;
  }

  async createExpense(data: ExpenseFormData): Promise<Expense> {
    const response: AxiosResponse<ApiResponse<Expense>> = await this.api.post('/expenses', data);
    return response.data.data;
  }

  async updateExpense(id: string, data: Partial<ExpenseFormData>): Promise<Expense> {
    const response: AxiosResponse<ApiResponse<Expense>> =
      await this.api.put(`/expenses/${id}`, data);
    return response.data.data;
  }

  async deleteExpense(id: string): Promise<void> {
    await this.api.delete(`/expenses/${id}`);
  }

  // Dashboard APIs
  async getDashboardSummary(): Promise<DashboardSummary> {
    const response: AxiosResponse<ApiResponse<DashboardSummary>> =
      await this.api.get('/dashboard/summary');
    return response.data.data;
  }

  // User Management APIs (Admin only)
  async getUsers(): Promise<User[]> {
    const response: AxiosResponse<ApiResponse<User[]>> = await this.api.get('/users');
    return response.data.data;
  }

  async createUser(data: RegisterData): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.post('/users', data);
    return response.data.data;
  }

  async updateUser(id: string, data: Partial<RegisterData>): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.put(`/users/${id}`, data);
    return response.data.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  // Reports APIs
  async getSalesReport(startDate: string, endDate: string, carId?: string): Promise<any> {
    const params = { startDate, endDate, ...(carId && { carId }) };
    const response: AxiosResponse<ApiResponse<any>> =
      await this.api.get('/reports/sales', { params });
    return response.data.data;
  }

  async getExpenseReport(startDate: string, endDate: string, carId?: string): Promise<any> {
    const params = { startDate, endDate, ...(carId && { carId }) };
    const response: AxiosResponse<ApiResponse<any>> =
      await this.api.get('/reports/expenses', { params });
    return response.data.data;
  }

  async getProfitReport(startDate: string, endDate: string, carId?: string): Promise<any> {
    const params = { startDate, endDate, ...(carId && { carId }) };
    const response: AxiosResponse<ApiResponse<any>> =
      await this.api.get('/reports/profit', { params });
    return response.data.data;
  }
}

export default new ApiService();
