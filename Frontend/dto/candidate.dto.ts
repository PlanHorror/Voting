export interface CandidateDto {
  id: string;
  hashId: string;
  name: string;
  description: string;
  totalVotes: number;
}

export interface CandidateCreateDto {
  name: string;
  description: string;
}
