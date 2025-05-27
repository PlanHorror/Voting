import { Role } from "@/shared/enum/role.enum";
export interface UserSignUpDto {
  citizenId: string;
  phone: string;
  password: string;
}

export interface UserSignInDto {
  citizenId: string;
  password: string;
}

export interface UserUpdateDto {
  citizenId: string;
  phone: string;
  old_password?: string;
  new_password?: string;
  confirm_password?: string;
}

export interface SupervisorSignUpDto {
  username: string;
  password: string;
}

export interface SupervisorSignInDto {
  username: string;
  password: string;
}

export interface SignerSignUpDto {
  username: string;
  password: string;
}

export interface SignerSignInDto {
  username: string;
  password: string;
}

export interface UserTokenDto {
  accessToken: string;
  id: string;
  role: Role;
}
