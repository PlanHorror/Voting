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

export interface SupervisorUpdateDto {
  username: string;
  old_password?: string;
  new_password?: string;
  confirm_password?: string;
}
