import { AxiosResponse } from "axios";
import { Car, CarFormData, ApiResponse } from "../types";
import HttpService from "./HttpService";

class CarService extends HttpService {
  constructor() {
    super();
  }

  async getCars(): Promise<Car[]> {
    const response: AxiosResponse<ApiResponse<Car[]>> = await this.api.get(
      "/cars"
    );
    return response.data.data;
  }

  async getCarById(id: string): Promise<Car> {
    const response: AxiosResponse<ApiResponse<Car>> = await this.api.get(
      `/cars/${id}`
    );
    return response.data.data;
  }

  async createCar(data: CarFormData): Promise<Car> {
    const response: AxiosResponse<ApiResponse<Car>> = await this.api.post(
      "/cars",
      data
    );
    return response.data.data;
  }

  async updateCar(id: string, data: Partial<CarFormData>): Promise<Car> {
    const response: AxiosResponse<ApiResponse<Car>> = await this.api.put(
      `/cars/${id}`,
      data
    );
    return response.data.data;
  }

  async deleteCar(id: string): Promise<void> {
    await this.api.delete(`/cars/${id}`);
  }

  async assignProduct(
    carId: string,
    data: { productId: string; quantity: number }
  ): Promise<Car> {
    const response: AxiosResponse<ApiResponse<Car>> = await this.api.post(
      `/cars/${carId}/products`,
      data
    );
    return response.data.data;
  }

  async removeProduct(carId: string, productId: string): Promise<void> {
    await this.api.delete(`/cars/${carId}/products/${productId}`);
  }
}

export default new CarService();
