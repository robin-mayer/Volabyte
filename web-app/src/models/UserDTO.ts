import type { UserRole } from "../types/UserRole";

export interface UserDTO {
  userId: string;
  userName: string;
  displayName: string;
  role: UserRole;
}
