import { Role } from '../enum';

export interface Payload {
  id: string;
  role: Role;
  username?: string;
  citizenId?: string;
}
