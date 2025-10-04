import { AxiosResponse } from "axios";
import {
  Product,
  PaginatedResponse,
  ProductFormData,
  StockMovement,
  ApiResponse,
} from "../types";
import HttpService from "./HttpService";

class ProductService extends HttpService {
  constructor() {
    super();
  }

  async getProducts(
    page: number = 1,
    limit: number = 10,
    search?: string
  ): Promise<PaginatedResponse<Product>> {
    const params = { page, limit, ...(search && { search }) };
    const response: AxiosResponse<PaginatedResponse<Product>> =
      await this.api.get("/products", { params });
    return response.data;
  }

  async getProduct(id: string): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.api.get(
      `/products/${id}`
    );
    return response.data.data;
  }

  async createProduct(data: ProductFormData): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.api.post(
      "/products",
      data
    );
    return response.data.data;
  }

  async updateProduct(
    id: string,
    data: Partial<ProductFormData>
  ): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.api.patch(
      `/products/${id}`,
      data
    );
    return response.data.data;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.api.delete(`/products/${id}`);
  }

  async updateStock(
    productId: string,
    quantity: number,
    type: "in" | "out",
    reason: string
  ): Promise<Product> {
    const response: AxiosResponse<ApiResponse<Product>> = await this.api.post(
      `/products/${productId}/stock`,
      { quantity, type, reason }
    );
    return response.data.data;
  }

  async getStockMovements(productId: string): Promise<StockMovement[]> {
    const response: AxiosResponse<ApiResponse<StockMovement[]>> =
      await this.api.get(`/products/${productId}/stock-movements`);
    return response.data.data;
  }
}

export default new ProductService();
