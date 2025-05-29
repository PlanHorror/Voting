import axios from "axios";
import { SignerCreateDto, SignerDto, SignerUpdateDto } from "@/dto/signer.dto";
import { AuthService } from "./auth.service";
import { VoteSessionDto } from "@/dto/vote-session.dto";

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
   * Get a signer by ID
   * @param id The ID of the signer to retrieve
   * @returns Promise with the signer details
   */
  static async getSignerById(id: string): Promise<SignerDto> {
    try {
      const response = await axios.get<SignerDto>(
        `${this.BACKEND_URL}/signer/find/${id}`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error(`Error fetching signer with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new signer
   * @param signerData The data for creating a new signer
   * @returns Promise with the created signer
   */
  static async createSigner(signerData: SignerCreateDto): Promise<SignerDto> {
    try {
      const response = await axios.post<SignerDto>(
        `${this.BACKEND_URL}/auth/signer/register`,
        signerData,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  }

  /**
   * Update a signer profile
   * @param signerData The data for updating the signer
   * @returns Promise with the updated signer
   */
  static async updateSigner(signerData: SignerUpdateDto): Promise<SignerDto> {
    try {
      const response = await axios.put<SignerDto>(
        `${this.BACKEND_URL}/signer`,
        signerData,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error updating signer:", error);
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

  /**
   * Get vote sessions for a specific signer
   * @param signerId The ID of the signer
   * @returns Promise with an array of vote sessions assigned to the signer
   */
  static async getVoteSessionsBySigner(): Promise<VoteSessionDto[]> {
    try {
      const response = await axios.get<VoteSessionDto[]>(
        `${this.BACKEND_URL}/session/signer/`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error(
        `Error fetching vote sessions for signer ${signerId}:`,
        error
      );
      throw error;
    }
  }

  /**
   * Get signer profile
   * @returns Promise with the signer profile
   * */
  static async getSignerProfile(): Promise<SignerDto> {
    try {
      const response = await axios.get<SignerDto>(
        `${this.BACKEND_URL}/signer/profile`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching signer profile:", error);
      throw error;
    }
  }

  /**
   * Count total user
   * @return Promise with total users
   * */
  static async countTotalUsers(): Promise<number> {
    try {
      const response = await axios.get<number>(
        `${this.BACKEND_URL}/user/count`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error counting users:", error);
      throw error;
    }
  }
}
