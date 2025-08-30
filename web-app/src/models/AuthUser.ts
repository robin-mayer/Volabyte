import type { UserRole } from "../types/UserRole";

export interface AuthUser {
  accessToken: string;
  id: string;
  userName: string;
  displayName: string;
  role: UserRole;
}
