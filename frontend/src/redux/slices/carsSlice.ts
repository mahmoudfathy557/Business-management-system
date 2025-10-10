import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { carService } from "../../services/api";
import { Car } from "../../types";

// Define the state structure for the cars slice
interface CarsState {
  cars: Car[];
  selectedCar: Car | null;
  isLoading: boolean;
  error: string | null;
}

// Initial state for the cars slice
const initialState: CarsState = {
  cars: [],
  selectedCar: null,
  isLoading: false,
  error: null,
};

// Async Thunks for Cars
export const fetchCars = createAsyncThunk("cars/fetchCars", async () => {
  return carService.getCars();
});

export const fetchCarById = createAsyncThunk(
  "cars/fetchCarById",
  async (id: string) => {
    return carService.getCarById(id);
  }
);

export const createCar = createAsyncThunk(
  "cars/createCar",
  async (data: any) => {
    return carService.createCar(data);
  }
);

export const updateCar = createAsyncThunk(
  "cars/updateCar",
  async ({ id, data }: { id: string; data: any }) => {
    return carService.updateCar(id, data);
  }
);

export const deleteCar = createAsyncThunk(
  "cars/deleteCar",
  async (id: string) => {
    await carService.deleteCar(id);
    return id;
  }
);

export const assignProductToCar = createAsyncThunk(
  "cars/assignProduct",
  async ({ carId, data }: { carId: string; data: any }) => {
    return carService.assignProduct(carId, data);
  }
);

export const removeProductFromCar = createAsyncThunk(
  "cars/removeProduct",
  async ({ carId, productId }: { carId: string; productId: string }) => {
    await carService.removeProduct(carId, productId);
    return { carId, productId };
  }
);

// Cars Slice
const carsSlice = createSlice({
  name: "cars",
  initialState,
  reducers: {
    clearCarsError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all cars
      .addCase(fetchCars.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCars.fulfilled, (state, action) => {
        state.isLoading = false;
        state.cars = action.payload;
      })
      .addCase(fetchCars.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch cars";
      })
      // Fetch car by ID
      .addCase(fetchCarById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCarById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedCar = action.payload;
      })
      .addCase(fetchCarById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to fetch car details";
      })
      // Create, Update, Delete
      .addCase(createCar.fulfilled, (state, action) => {
        state.cars.push(action.payload);
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        const index = state.cars.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.cars[index] = action.payload;
        }
        if (state.selectedCar?._id === action.payload._id) {
          state.selectedCar = action.payload;
        }
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.cars = state.cars.filter((c) => c._id !== action.payload);
      })
      // Product assignments
      .addCase(assignProductToCar.fulfilled, (state, action) => {
        state.selectedCar = action.payload;
        const index = state.cars.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.cars[index] = action.payload;
        }
      })
      .addCase(removeProductFromCar.fulfilled, (state, action) => {
        if (state.selectedCar) {
          state.selectedCar.assignedProducts =
            state.selectedCar.assignedProducts.filter(
              (p) => p.productId._id !== action.payload.productId
            );
        }
      });
  },
});

export const { clearCarsError } = carsSlice.actions;
export { carsSlice };
