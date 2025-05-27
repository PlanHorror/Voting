import CandidateDto from "./candidate.dto";

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
  createdAt: Date;
  updatedAt: Date;
}
