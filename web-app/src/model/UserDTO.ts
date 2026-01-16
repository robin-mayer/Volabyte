import type { UserRole } from "./UserRole";

export interface UserDTO {
  id: string;
  userName: string;
  displayName: string;
  role: UserRole;
  lastLoginAt: Date | null;
}
