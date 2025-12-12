import type { UserRole } from "../types/UserRole";

export interface UserDTO {
  id: string;
  userName: string;
  displayName: string;
  role: UserRole;
  lastLoginAt: Date | null;
}
