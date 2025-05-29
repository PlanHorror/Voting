import axios from "axios";
import { UserUpdateDto } from "@/dto/auth.dto";
import { UserDto } from "@/dto/user.dto";
import { AuthService } from "./auth.service";

export class UserService {
  private static BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  /**
   * Get user by ID
   * @param id The ID of the user to retrieve
   * @returns Promise with the user details
   */
  static async getUserById(id: string): Promise<UserDto> {
    try {
      const response = await axios.get<UserDto>(
        `${this.BACKEND_URL}/user/${id}`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error(`Error fetching user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Update a user profile
   * @param userData The data for updating the user
   * @returns Promise with the updated user
   */
  static async updateUser(userData: UserUpdateDto): Promise<UserDto> {
    try {
      const response = await axios.put<UserDto>(
        `${this.BACKEND_URL}/user`,
        userData,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  /**
   * Get current user profile
   * @returns Promise with the user profile
   */
  static async getUserProfile(): Promise<UserDto> {
    try {
      const response = await axios.get<UserDto>(
        `${this.BACKEND_URL}/user/profile`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching user profile:", error);
      throw error;
    }
  }

  /**
   * Get all users (admin only)
   * @returns Promise with an array of users
   */
  static async getAllUsers(): Promise<UserDto[]> {
    try {
      const response = await axios.get<UserDto[]>(
        `${this.BACKEND_URL}/user/all`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  }

  /**
   * Delete a user by ID (admin only)
   * @param id The ID of the user to delete
   */
  static async deleteUser(id: string): Promise<void> {
    try {
      await axios.delete(`${this.BACKEND_URL}/user/${id}`, {
        headers: this.getAuthHeader(),
      });
    } catch (error: unknown) {
      console.error(`Error deleting user with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Helper method to get auth headers
   * @returns Object with Authorization header
   */
  private static getAuthHeader() {
    const token = AuthService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
