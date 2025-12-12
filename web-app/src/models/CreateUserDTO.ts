import type { UserRole } from "../types/UserRole";

export interface CreateUserDTO {
  userName: string;
  displayName: string;
  password: string;
  role: UserRole;
}
