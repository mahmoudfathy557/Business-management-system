import { AxiosResponse } from "axios";
import { User, RegisterData, ApiResponse } from "../types";
import HttpService from "./HttpService";

class UserService extends HttpService {
  constructor() {
    super();
  }

  async getUsers(): Promise<User[]> {
    const response: AxiosResponse<ApiResponse<User[]>> = await this.api.get(
      "/users"
    );
    return response.data.data;
  }

  async createUser(data: RegisterData): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.post(
      "/users",
      data
    );
    return response.data.data;
  }

  async updateUser(id: string, data: Partial<RegisterData>): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.put(
      `/users/${id}`,
      data
    );
    return response.data.data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }
}

export default new UserService();
