import axios from "axios";
import { AuthService } from "./auth.service";
import { StatsDto } from "../dto/stats.dto";
import { AccountDistributionDto } from "@/dto/account-distribution.dto";
import { VoteSessionDistributionDto } from "../dto/vote-session-distribution.dto";
import {
  SupervisorCreateDto,
  SupervisorDto,
  SupervisorUpdateDto,
} from "@/dto/supervisor.dto";

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
   * Get all supervisors
   * @returns Promise with an array of supervisors
   */
  static async getAllSupervisors(): Promise<SupervisorDto[]> {
    try {
      const response = await axios.get<SupervisorDto[]>(
        `${this.BACKEND_URL}/supervisor`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching supervisors:", error);
      throw error;
    }
  }

  /**
   * Delete a supervisor by ID
   * @param id The ID of the supervisor to delete
   * @returns Promise with the deletion result
   */
  static async deleteSupervisor(id: string): Promise<void> {
    try {
      await axios.delete(`${this.BACKEND_URL}/supervisor/${id}`, {
        headers: this.getAuthHeader(),
      });
    } catch (error: unknown) {
      console.error(`Error deleting supervisor with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new supervisor
   * @param supervisorData The data for creating a new supervisor
   * @returns Promise with the created supervisor
   */
  static async createSupervisor(
    supervisorData: SupervisorCreateDto
  ): Promise<SupervisorDto> {
    try {
      const response = await axios.post<SupervisorDto>(
        `${this.BACKEND_URL}/auth/supervisor/register`,
        supervisorData,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error creating supervisor:", error);
      throw error;
    }
  }

  /**
   * Update a supervisor profile
   * @param supervisorData The data for updating the supervisor
   * @returns Promise with the updated supervisor
   */
  static async updateSupervisor(
    supervisorData: SupervisorUpdateDto
  ): Promise<SupervisorDto> {
    try {
      const response = await axios.put<SupervisorDto>(
        `${this.BACKEND_URL}/supervisor`,
        supervisorData,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error updating supervisor:", error);
      throw error;
    }
  }

  /**
   * Get current supervisor profile
   * @returns Promise with the supervisor profile
   */
  static async getSupervisorProfile(): Promise<SupervisorDto> {
    try {
      const response = await axios.get<SupervisorDto>(
        `${this.BACKEND_URL}/supervisor/profile`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching supervisor profile:", error);
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
