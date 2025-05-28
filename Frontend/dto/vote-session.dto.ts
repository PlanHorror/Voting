import { CandidateCreateDto, CandidateDto } from "./candidate.dto";
import { VoteDto } from "./vote.dto";
import { VoteParticipantDto } from "./vote-participants.dto";
import { SignerDto } from "./signer.dto";

export interface VoteSessionDto {
  id: string;
  supervisorId: string;
  signerId: string;
  title: string;
  description: string;
  endDate: Date;
  candidates: CandidateDto[];
  votes: VoteDto[];
  voteParticipants: VoteParticipantDto[];
  signer: SignerDto;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoteSessionCreateDto {
  title: string;
  description: string;
  endDate: string;
  supervisorId: string;
  signerId: string;
}

export interface VoteSessionCandidateDto {
  voteSessionId: string;
  candidates: CandidateCreateDto[];
}
