import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiService from '../services/api';
import {
  User,
  AuthState,
  LoginCredentials,
  RegisterData,
  Product,
  Car,
  Expense,
  DailyRecord,
  DashboardSummary,
  UserRole,
  ExpenseType
} from '../types';

// Auth Slice
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiService.login(credentials);
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await apiService.register(data);
      await AsyncStorage.setItem('authToken', response.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed');
    }
  }
);

export const loadUserFromStorage = createAsyncThunk(
  'auth/loadUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userStr = await AsyncStorage.getItem('user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        return { user, token };
      }
      return null;
    } catch (error) {
      return rejectWithValue('Failed to load user data');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
  } as AuthState & { error: string | null },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.isAuthenticated = true;
        }
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

// Products Slice
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ page = 1, limit = 10, search }: { page?: number; limit?: number; search?: string }) => {
    const response = await apiService.getProducts(page, limit, search);
    return response;
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (data: any) => {
    const response = await apiService.createProduct(data);
    return response;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await apiService.updateProduct(id, data);
    return response;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id: string) => {
    await apiService.deleteProduct(id);
    return id;
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [] as Product[],
    total: 0,
    page: 1,
    limit: 10,
    isLoading: false,
    error: null as string | null,
  },
  reducers: {
    clearProductsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.data || [];
        state.total = action.payload.total || 0;
        state.page = action.payload.page || 1;
        state.limit = action.payload.limit || 10;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter(p => p.id !== action.payload);
      });
  },
});

// Cars Slice
export const fetchCars = createAsyncThunk(
  'cars/fetchCars',
  async () => {
    const response = await apiService.getCars();

    return response;
  }
);

export const createCar = createAsyncThunk(
  'cars/createCar',
  async (data: any) => {
    const response = await apiService.createCar(data);
    return response;
  }
);

export const updateCar = createAsyncThunk(
  'cars/updateCar',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await apiService.updateCar(id, data);
    return response;
  }
);

export const deleteCar = createAsyncThunk(
  'cars/deleteCar',
  async (id: string) => {
    await apiService.deleteCar(id);
    return id;
  }
);

const carsSlice = createSlice({
  name: 'cars',
  initialState: {
    cars: [] as Car[],
    isLoading: false,
    error: null as string | null,
  },
  reducers: {
    clearCarsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCars.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cars = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch cars';
      })
      .addCase(createCar.fulfilled, (state, action) => {
        state.cars.push(action.payload);
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        const index = state.cars.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.cars[index] = action.payload;
        }
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.cars = state.cars.filter(c => c.id !== action.payload);
      });
  },
});

// Dashboard Slice
export const fetchDashboardSummary = createAsyncThunk(
  'dashboard/fetchSummary',
  async () => {
    const response = await apiService.getDashboardSummary();

    return response;
  }
);

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    summary: null as DashboardSummary | null,
    isLoading: false,
    error: null as string | null,
  },
  reducers: {
    clearDashboardError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardSummary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.summary = action.payload;
      })
      .addCase(fetchDashboardSummary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch dashboard data';
      });
  },
});

// Expenses Slice
interface ExpensesState {
  expenses: Expense[];
  totalExpenses: number;
  expensesByType: Record<ExpenseType, number>;
  isLoading: boolean;
  error: string | null;
}

const initialExpensesState: ExpensesState = {
  expenses: [],
  totalExpenses: 0,
  expensesByType: {
    [ExpenseType.FUEL]: 0,
    [ExpenseType.MAINTENANCE]: 0,
    [ExpenseType.SALARY]: 0,
    [ExpenseType.OTHER]: 0,
  },
  isLoading: false,
  error: null,
};

export const fetchExpenses = createAsyncThunk(
  'expenses/fetchExpenses',
  async ({ page = 1, limit = 50, period = 'today' }: { page?: number; limit?: number; period?: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.getExpenses(page, limit, period);

      return response; // Return the full response object
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch expenses');
    }
  }
);

export const createExpense = createAsyncThunk(
  'expenses/createExpense',
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await apiService.createExpense(data);

      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create expense');
    }
  }
);

export const updateExpense = createAsyncThunk(
  'expenses/updateExpense',
  async ({ id, data }: { id: string; data: any }, { rejectWithValue }) => {
    try {
      const response = await apiService.updateExpense(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update expense');
    }
  }
);

export const deleteExpense = createAsyncThunk(
  'expenses/deleteExpense',
  async (id: string, { rejectWithValue }) => {
    try {
      await apiService.deleteExpense(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete expense');
    }
  }
);

const expensesSlice = createSlice({
  name: 'expenses',
  initialState: initialExpensesState,
  reducers: {
    clearExpensesError: (state) => {
      state.error = null;
    },
    resetExpensesState: () => initialExpensesState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchExpenses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.expenses = action.payload.data;

        // Calculate totals
        const total = action.payload.data.reduce((sum: number, expense: Expense) => sum + expense.amount, 0);
        state.totalExpenses = total;

        // Calculate by type
        const byType = action.payload.data.reduce((acc: Record<ExpenseType, number>, expense: Expense) => {
          acc[expense.type] = (acc[expense.type] || 0) + expense.amount;
          return acc;
        }, {} as Record<ExpenseType, number>);
        state.expensesByType = byType;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.expenses.unshift(action.payload);
        state.totalExpenses += action.payload.amount;
        state.expensesByType[action.payload.type] = (state.expensesByType[action.payload.type] || 0) + action.payload.amount;
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        const index = state.expenses.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          const oldExpense = state.expenses[index];
          state.totalExpenses -= oldExpense.amount;
          state.expensesByType[oldExpense.type] = (state.expensesByType[oldExpense.type] || 0) - oldExpense.amount;

          state.expenses[index] = action.payload;

          state.totalExpenses += action.payload.amount;
          state.expensesByType[action.payload.type] = (state.expensesByType[action.payload.type] || 0) + action.payload.amount;
        }
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        const deletedExpense = state.expenses.find(e => e.id === action.payload);
        if (deletedExpense) {
          state.expenses = state.expenses.filter(e => e.id !== action.payload);
          state.totalExpenses -= deletedExpense.amount;
          state.expensesByType[deletedExpense.type] = (state.expensesByType[deletedExpense.type] || 0) - deletedExpense.amount;
        }
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export const { clearProductsError } = productsSlice.actions;
export const { clearCarsError } = carsSlice.actions;
export const { clearDashboardError } = dashboardSlice.actions;
export const { clearExpensesError, resetExpensesState } = expensesSlice.actions;

export {
  authSlice,
  productsSlice,
  carsSlice,
  dashboardSlice,
  expensesSlice,
};
