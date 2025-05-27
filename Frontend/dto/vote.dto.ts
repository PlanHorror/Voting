export interface VoteDto {
  id: string;
  voteSessionId: string;
  candidateId?: string;
  key: string;
  isVoted: boolean;
  voteAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
