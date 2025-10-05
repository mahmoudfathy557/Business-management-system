import { AxiosResponse } from "axios";
import { DailyRecord, ApiResponse, SaleItem } from "../types";
import HttpService from "./HttpService";

class DailyRecordService extends HttpService {
  constructor() {
    super();
  }

  async createDailyRecord(data: {
    carId: string;
    driverId: string;
    date: string;
    totalSales: number;
    totalExpenses: number;
    sales: SaleItem[];
    notes?: string;
  }): Promise<DailyRecord> {
    const response: AxiosResponse<ApiResponse<DailyRecord>> =
      await this.api.post("/daily-records", data);
    return response.data.data;
  }

  async getDailyRecords(
    carId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<DailyRecord[]> {
    const params = {
      ...(carId && { carId }),
      ...(startDate && { startDate }),
      ...(endDate && { endDate }),
    };
    const response: AxiosResponse<ApiResponse<DailyRecord[]>> =
      await this.api.get("/daily-records", { params });
    return response.data.data;
  }
}

export default new DailyRecordService();
