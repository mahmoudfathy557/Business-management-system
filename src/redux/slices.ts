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
  UserRole
} from '../types';

// Auth Slice
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiService.login(credentials);
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
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
      await AsyncStorage.setItem('authToken', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
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
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await apiService.updateProduct(id, data);
    return response.data;
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
        state.products = action.payload.data;
        state.total = action.payload.total;
        state.page = action.payload.page;
        state.limit = action.payload.limit;
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
    return response.data;
  }
);

export const createCar = createAsyncThunk(
  'cars/createCar',
  async (data: any) => {
    const response = await apiService.createCar(data);
    return response.data;
  }
);

export const updateCar = createAsyncThunk(
  'cars/updateCar',
  async ({ id, data }: { id: string; data: any }) => {
    const response = await apiService.updateCar(id, data);
    return response.data;
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
    return response.data;
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

export const { clearError } = authSlice.actions;
export const { clearProductsError } = productsSlice.actions;
export const { clearCarsError } = carsSlice.actions;
export const { clearDashboardError } = dashboardSlice.actions;

export {
  authSlice,
  productsSlice,
  carsSlice,
  dashboardSlice,
};
