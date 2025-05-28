import axios from "axios";
import { SignerDto } from "@/dto/signer.dto";
import { AuthService } from "./auth.service";

export class SignerService {
  private static BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  /**
   * Get all signers
   * @returns Promise with an array of signers
   */
  static async getAllSigners(): Promise<SignerDto[]> {
    try {
      const response = await axios.get<SignerDto[]>(
        `${this.BACKEND_URL}/signer`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching signers:", error);
      throw error;
    }
  }

  /**
   * Delete a signer by ID
   * @param id The ID of the signer to delete
   * @returns Promise with the deletion result
   */
  static async deleteSigner(id: string): Promise<void> {
    try {
      const response = await axios.delete(`${this.BACKEND_URL}/signer/${id}`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error: unknown) {
      console.error("Error deleting signer:", error);
      throw error;
    }
  }

  /**
   * Get the authentication header
   * @returns Object containing the authorization header
   */
  private static getAuthHeader() {
    const token = AuthService.getToken();
    return {
      Authorization: `Bearer ${token}`,
    };
  }
}
