export interface SupervisorDto {
  id: string;
  username: string;
  updatedAt: Date;
  createdAt: Date;
}

export interface SupervisorCreateDto {
  username: string;
  password: string;
}
