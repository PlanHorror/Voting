import { VoteSessionDto } from "./vote-session.dto";

export interface SignerDto {
  id: string;
  username: string;
  email: string;
  phone: string;
  _count: {
    voteSessions: number;
  };
  voteSessions: Omit<
    VoteSessionDto,
    "candidates" | "votes" | "signer" | "voteParticipants"
  >[];
  updatedAt: Date;
  createdAt: Date;
}

export interface SignerCreateDto {
  username: string;
  email: string;
  phone: string;
  password: string;
}
