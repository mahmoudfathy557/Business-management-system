import { AxiosResponse } from "axios";
import { ApiResponse } from "../types";
import HttpService from "./HttpService";

class ReportService extends HttpService {
  constructor() {
    super();
  }

  async getSalesReport(
    startDate: string,
    endDate: string,
    carId?: string
  ): Promise<any> {
    const params = { startDate, endDate, ...(carId && { carId }) };
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get(
      "/reports/sales",
      { params }
    );
    return response.data.data;
  }

  async getExpenseReport(
    startDate: string,
    endDate: string,
    carId?: string
  ): Promise<any> {
    const params = { startDate, endDate, ...(carId && { carId }) };
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get(
      "/reports/expenses",
      { params }
    );
    return response.data.data;
  }

  async getProfitReport(
    startDate: string,
    endDate: string,
    carId?: string
  ): Promise<any> {
    const params = { startDate, endDate, ...(carId && { carId }) };
    const response: AxiosResponse<ApiResponse<any>> = await this.api.get(
      "/reports/profit",
      { params }
    );
    return response.data.data;
  }
}

export default new ReportService();
