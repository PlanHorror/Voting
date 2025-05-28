import axios from "axios";
import {
  VoteSessionCandidateDto,
  VoteSessionCreateDto,
  VoteSessionDto,
} from "../dto/vote-session.dto";
import { VoteParticipantKeyDto } from "../dto/vote-participants.dto";
import { CandidateCreateDto, CandidateDto } from "../dto/candidate.dto";
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
  // Get vote session by supervisor
  static async getVoteSessionsBySupervisorId(
    supervisorId: string
  ): Promise<VoteSessionDto[]> {
    try {
      const response = await axios.get<VoteSessionDto[]>(
        `${this.BACKEND_URL}/session`,
        {
          headers: this.getAuthHeader(),
        }
      );
      console.log(response.data[0].signer);
      return response.data;
    } catch (error: unknown) {
      console.error(
        `Error fetching vote sessions for supervisor ${supervisorId}:`,
        error
      );
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
    data: VoteSessionCreateDto
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

  static async createVoteSessionWithCandidates(
    sessionData: VoteSessionCreateDto,
    candidatesData: CandidateCreateDto[]
  ): Promise<VoteSessionDto> {
    try {
      // First create the vote session
      const session = await this.createVoteSession(sessionData);

      // Then create the candidates using the session ID
      if (candidatesData.length > 0) {
        await this.createManyCandidates(session.id, candidatesData);

        // Fetch the updated session with candidates included
        return await this.getVoteSessionById(session.id);
      }

      return session;
    } catch (error: unknown) {
      console.error("Error creating vote session with candidates:", error);
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
  // static async getCandidatesByVoteSessionId(
  //   voteSessionId: string
  // ): Promise<CandidateDto[]> {
  //   try {
  //     const response = await axios.get<CandidateDto[]>(
  //       `${this.BACKEND_URL}/session/candidates/vote-session/${voteSessionId}`,
  //       {
  //         headers: this.getAuthHeader(),
  //       }
  //     );
  //     return response.data;
  //   } catch (error: unknown) {
  //     console.error(
  //       `Error fetching candidates for vote session ${voteSessionId}:`,
  //       error
  //     );
  //     throw error;
  //   }
  // }

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
    candidates: CandidateCreateDto[]
  ): Promise<CandidateDto[]> {
    try {
      const voteSessionCandidateDto: VoteSessionCandidateDto = {
        voteSessionId,
        candidates,
      };

      const response = await axios.post<CandidateDto[]>(
        `${this.BACKEND_URL}/session/candidates/many`,
        voteSessionCandidateDto,
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

  static async deleteAllCandidatesForVoteSession(
    voteSessionId: string
  ): Promise<void> {
    try {
      await axios.delete(
        `${this.BACKEND_URL}/session/candidates/vote-session/${voteSessionId}`,
        {
          headers: this.getAuthHeader(),
        }
      );
    } catch (error: unknown) {
      console.error(
        `Error deleting all candidates for vote session ${voteSessionId}:`,
        error
      );
      throw error;
    }
  }

  // Vote operations
  // static async getAllVotes(): Promise<VoteDto[]> {
  //   try {
  //     const response = await axios.get<VoteDto[]>(
  //       `${this.BACKEND_URL}/votes/all`
  //     );
  //     return response.data;
  //   } catch (error: unknown) {
  //     console.error("Error fetching all votes:", error);
  //     throw error;
  //   }
  // }

  // static async getVotesByVoteSessionId(
  //   voteSessionId: string
  // ): Promise<VoteDto[]> {
  //   try {
  //     const response = await axios.get<VoteDto[]>(
  //       `${this.BACKEND_URL}/votes/session/${voteSessionId}`
  //     );
  //     return response.data;
  //   } catch (error: unknown) {
  //     console.error(
  //       `Error fetching votes for vote session ${voteSessionId}:`,
  //       error
  //     );
  //     throw error;
  //   }
  // }

  static async castVote(
    voteSessionId: string,
    candidateIdHash: string,
    key: string
  ): Promise<void> {
    try {
      await axios.post(`${this.BACKEND_URL}/votes/session/${voteSessionId}`, {
        candidateIdHash: candidateIdHash,
        key: key,
      });
    } catch (error: unknown) {
      // console.error(error);
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
      throw error;
    }
  }

  // Helper method to get auth headers
  private static getAuthHeader() {
    const token = AuthService.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
