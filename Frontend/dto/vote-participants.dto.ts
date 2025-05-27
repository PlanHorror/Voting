export interface VoteParticipantDto {
  id: string;
  userId: string;
  voteSessionId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VoteParticipantKeyDto {
  key: string;
}
