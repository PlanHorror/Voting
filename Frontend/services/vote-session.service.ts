import axios from "axios";
import { VoteSessionDto } from "../dto/vote-session.dto";
import {
  VoteParticipantDto,
  VoteParticipantKeyDto,
} from "../dto/vote-participants.dto";
import CandidateDto from "../dto/candidate.dto";
import { AuthService } from "./auth.service";

export class VoteSessionService {
  private static BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  // Vote Session operations
  static async getAllVoteSessions(): Promise<VoteSessionDto[]> {
    try {
      const response = await axios.get<VoteSessionDto[]>(
        `${this.BACKEND_URL}/session/all`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching vote sessions:", error);
      throw error;
    }
  }

  static async getVoteSessionById(id: string): Promise<VoteSessionDto> {
    try {
      const response = await axios.get<VoteSessionDto>(
        `${this.BACKEND_URL}/session/find/${id}`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error(`Error fetching vote session with ID ${id}:`, error);
      throw error;
    }
  }

  static async createVoteSession(
    data: Partial<VoteSessionDto>
  ): Promise<VoteSessionDto> {
    try {
      const response = await axios.post<VoteSessionDto>(
        `${this.BACKEND_URL}/session`,
        data,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error creating vote session:", error);
      throw error;
    }
  }

  static async updateVoteSession(
    id: string,
    data: Partial<VoteSessionDto>
  ): Promise<VoteSessionDto> {
    try {
      const response = await axios.put<VoteSessionDto>(
        `${this.BACKEND_URL}/session/${id}`,
        data,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error(`Error updating vote session with ID ${id}:`, error);
      throw error;
    }
  }

  static async deleteVoteSession(id: string): Promise<void> {
    try {
      await axios.delete(`${this.BACKEND_URL}/session/${id}`, {
        headers: this.getAuthHeader(),
      });
    } catch (error: unknown) {
      console.error(`Error deleting vote session with ID ${id}:`, error);
      throw error;
    }
  }

  // Candidate operations
  static async getCandidatesByVoteSessionId(
    voteSessionId: string
  ): Promise<CandidateDto[]> {
    try {
      const response = await axios.get<CandidateDto[]>(
        `${this.BACKEND_URL}/session/candidates/vote-session/${voteSessionId}`,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error(
        `Error fetching candidates for vote session ${voteSessionId}:`,
        error
      );
      throw error;
    }
  }

  static async createCandidate(
    data: Partial<CandidateDto>
  ): Promise<CandidateDto> {
    try {
      const response = await axios.post<CandidateDto>(
        `${this.BACKEND_URL}/session/candidates`,
        data,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error creating candidate:", error);
      throw error;
    }
  }

  static async createManyCandidates(
    voteSessionId: string,
    candidates: Partial<CandidateDto>[]
  ): Promise<CandidateDto[]> {
    try {
      const response = await axios.post<CandidateDto[]>(
        `${this.BACKEND_URL}/session/candidates/many`,
        {
          voteSessionId,
          candidates,
        },
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error("Error creating multiple candidates:", error);
      throw error;
    }
  }

  static async updateCandidate(
    id: string,
    data: Partial<CandidateDto>
  ): Promise<CandidateDto> {
    try {
      const response = await axios.put<CandidateDto>(
        `${this.BACKEND_URL}/session/candidates/${id}`,
        data,
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error(`Error updating candidate with ID ${id}:`, error);
      throw error;
    }
  }

  static async deleteCandidate(id: string): Promise<void> {
    try {
      await axios.delete(`${this.BACKEND_URL}/session/candidates/${id}`, {
        headers: this.getAuthHeader(),
      });
    } catch (error: unknown) {
      console.error(`Error deleting candidate with ID ${id}:`, error);
      throw error;
    }
  }

  // Vote operations
  static async getAllVotes(): Promise<any[]> {
    try {
      const response = await axios.get<any[]>(`${this.BACKEND_URL}/votes/all`);
      return response.data;
    } catch (error: unknown) {
      console.error("Error fetching all votes:", error);
      throw error;
    }
  }

  static async getVotesByVoteSessionId(voteSessionId: string): Promise<any[]> {
    try {
      const response = await axios.get<any[]>(
        `${this.BACKEND_URL}/votes/session/${voteSessionId}`
      );
      return response.data;
    } catch (error: unknown) {
      console.error(
        `Error fetching votes for vote session ${voteSessionId}:`,
        error
      );
      throw error;
    }
  }

  static async castVote(
    voteSessionId: string,
    candidateId: string,
    key: string
  ): Promise<void> {
    try {
      await axios.post(`${this.BACKEND_URL}/votes/session/${voteSessionId}`, {
        candidateIdHash: candidateId,
        key: key,
      });
    } catch (error: unknown) {
      console.error("Error casting vote:", error);
      throw error;
    }
  }

  // Vote participant operations
  static async getVoteParticipantKey(
    voteSessionId: string
  ): Promise<VoteParticipantKeyDto> {
    try {
      const response = await axios.post<VoteParticipantKeyDto>(
        `${this.BACKEND_URL}/participant/session/${voteSessionId}`,
        {},
        {
          headers: this.getAuthHeader(),
        }
      );
      return response.data;
    } catch (error: unknown) {
      console.error(
        `Error getting vote participant key for session ${voteSessionId}:`,
        error
      );
      throw error;
    }
  }

  // Helper method to get auth headers
  private static getAuthHeader() {
    const token = AuthService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
