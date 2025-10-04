import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "../../services/api";
import { Product } from "../../types";

// Products Async Thunks
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({
    page = 1,
    limit = 10,
    search,
  }: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await productService.getProducts(page, limit, search);
    return response;
  }
);

export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (data: any) => {
    const response = await productService.createProduct(data);
    return response;
  }
);

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, data }: { id: string; data: any }) => {
    const response = await productService.updateProduct(id, data);
    return response;
  }
);

export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id: string) => {
    await productService.deleteProduct(id);
    return id;
  }
);

// Products Slice
const productsSlice = createSlice({
  name: "products",
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
        state.error = action.error.message || "Failed to fetch products";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.products.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearProductsError } = productsSlice.actions;
export { productsSlice };
