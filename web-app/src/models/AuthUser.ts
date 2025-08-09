import type { UserRole } from "../types/UserRole";

export interface AuthUser {
  accessToken: string;
  userId: string;
  userName: string;
  displayName: string;
  role: UserRole;
}
