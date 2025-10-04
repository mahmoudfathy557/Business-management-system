import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { carService } from "../../services/api";
import { Car } from "../../types";

// Cars Async Thunks
export const fetchCars = createAsyncThunk("cars/fetchCars", async () => {
  const response = await carService.getCars();
  return response;
});

export const createCar = createAsyncThunk(
  "cars/createCar",
  async (data: any) => {
    const response = await carService.createCar(data);
    return response;
  }
);

export const updateCar = createAsyncThunk(
  "cars/updateCar",
  async ({ id, data }: { id: string; data: any }) => {
    const response = await carService.updateCar(id, data);
    return response;
  }
);

export const deleteCar = createAsyncThunk(
  "cars/deleteCar",
  async (id: string) => {
    await carService.deleteCar(id);
    return id;
  }
);

// Cars Slice
const carsSlice = createSlice({
  name: "cars",
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
        state.error = action.error.message || "Failed to fetch cars";
      })
      .addCase(createCar.fulfilled, (state, action) => {
        state.cars.push(action.payload);
      })
      .addCase(updateCar.fulfilled, (state, action) => {
        const index = state.cars.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.cars[index] = action.payload;
        }
      })
      .addCase(deleteCar.fulfilled, (state, action) => {
        state.cars = state.cars.filter((c) => c.id !== action.payload);
      });
  },
});

export const { clearCarsError } = carsSlice.actions;
export { carsSlice };
