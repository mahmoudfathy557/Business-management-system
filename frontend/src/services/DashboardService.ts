import { AxiosResponse } from "axios";
import { DashboardSummary, ApiResponse } from "../types";
import HttpService from "./HttpService";

class DashboardService extends HttpService {
  constructor() {
    super();
  }

  async getDashboardSummary(): Promise<DashboardSummary> {
    const response: AxiosResponse<ApiResponse<DashboardSummary>> =
      await this.api.get("/dashboard/summary");
    return response.data.data;
  }
}

export default new DashboardService();
