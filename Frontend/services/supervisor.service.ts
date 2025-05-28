import axios from "axios";
import { AuthService } from "./auth.service";
import { StatsDto } from "../dto/stats.dto";
import { AccountDistributionDto } from "@/dto/account-distribution.dto";
import { VoteSessionDistributionDto } from "../dto/vote-session-distribution.dto";

// Define the shape of the MonthlySessionDto
interface MonthlySessionDto {
  month: string;
  count: number;
}

export class SupervisorService {
  private static BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  /**
   * Get dashboard statistics for the supervisor
   * @returns Promise with dashboard stats
   */
  static async getStats(): Promise<StatsDto> {
    try {
      const response = await axios.get<StatsDto>(
        `${this.BACKEND_URL}/supervisor/stats`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching supervisor stats:", error);
      throw error;
    }
  }

  /**
   * Get monthly session counts
   * @returns Promise with array of monthly session counts
   */
  static async getMonthlySessions(): Promise<MonthlySessionDto[]> {
    try {
      const response = await axios.get<MonthlySessionDto[]>(
        `${this.BACKEND_URL}/supervisor/sessions/monthly`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching monthly sessions:", error);
      throw error;
    }
  }

  /**
   * Get account distribution data
   * @returns Promise with account distribution data
   */
  static async getAccountDistribution(): Promise<AccountDistributionDto> {
    try {
      const response = await axios.get<AccountDistributionDto>(
        `${this.BACKEND_URL}/supervisor/account-distribution`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching account distribution:", error);
      throw error;
    }
  }

  /**
   * Get vote session distribution data
   * @returns Promise with vote session distribution data
   */
  static async getSessionDistribution(): Promise<VoteSessionDistributionDto> {
    try {
      const response = await axios.get<VoteSessionDistributionDto>(
        `${this.BACKEND_URL}/supervisor/sessions-distribution`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching session distribution:", error);
      throw error;
    }
  }

  /**
   * Helper method to get auth headers for authenticated requests
   * @returns Object with Authorization header if token exists
   */
  private static getAuthHeader() {
    const token = AuthService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
