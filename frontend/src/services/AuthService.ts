import { AxiosResponse } from "axios";
import { User, LoginCredentials, RegisterData, ApiResponse } from "../types";
import HttpService from "./HttpService";

class AuthService extends HttpService {
  constructor() {
    super();
  }

  async login(
    credentials: LoginCredentials
  ): Promise<{ user: User; token: string }> {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> =
      await this.api.post("/auth/login", credentials);
    return response.data.data;
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> =
      await this.api.post("/auth/register", data);
    return response.data.data;
  }

  async getProfile(): Promise<User> {
    const response: AxiosResponse<ApiResponse<User>> = await this.api.get(
      "/auth/profile"
    );
    return response.data.data;
  }
}

export default new AuthService();
