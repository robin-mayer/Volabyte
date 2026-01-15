import type { UserRole } from "./UserRole";

export interface CreateUserDTO {
  userName: string;
  displayName: string;
  password: string;
  role: UserRole;
}
