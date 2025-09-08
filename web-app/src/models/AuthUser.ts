import type { UserRole } from "../types/UserRole";

export interface AuthUser {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  id: string;
  userName: string;
  displayName: string;
  role: UserRole;
}
