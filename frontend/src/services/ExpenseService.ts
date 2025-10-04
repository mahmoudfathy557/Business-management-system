import { AxiosResponse } from "axios";
import {
  Expense,
  PaginatedResponse,
  ExpenseFormData,
  ApiResponse,
} from "../types";
import HttpService from "./HttpService";

class ExpenseService extends HttpService {
  constructor() {
    super();
  }

  async getExpenses(
    page: number = 1,
    limit: number = 10,
    period?: string
  ): Promise<PaginatedResponse<Expense>> {
    const params = { page, limit, ...(period && { period }) };
    const response: AxiosResponse<PaginatedResponse<Expense>> =
      await this.api.get("/expenses", { params });
    return response.data;
  }

  async createExpense(data: ExpenseFormData): Promise<Expense> {
    const response: AxiosResponse<ApiResponse<Expense>> = await this.api.post(
      "/expenses",
      data
    );
    return response.data.data;
  }

  async updateExpense(
    id: string,
    data: Partial<ExpenseFormData>
  ): Promise<Expense> {
    const response: AxiosResponse<ApiResponse<Expense>> = await this.api.put(
      `/expenses/${id}`,
      data
    );
    return response.data.data;
  }

  async deleteExpense(id: string): Promise<void> {
    await this.api.delete(`/expenses/${id}`);
  }
}

export default new ExpenseService();
