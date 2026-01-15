import type { AuthDataDTO } from "../models/AuthDataDTO";
import type { AuthUser } from "../models/AuthUser";
import type { UserDTO } from "../models/UserDTO";
import LocalStorage from "./LocalStorageService";
import Request from "./Request";

class AuthenticationService {
  async initialize(): Promise<AuthUser | null> {
    const refreshToken = LocalStorage.getRefreshToken();
    if (!refreshToken) {
      return null;
    }

    const refreshResponse = await Request.post("/users/session/refresh", null, {
      refreshToken: refreshToken,
    });
    if (!refreshResponse.ok) {
      LocalStorage.deleteRefreshToken();
      return null;
    }
    const authData: AuthDataDTO = await refreshResponse.json();

    const userResponse = await Request.get("/users/self", authData.accessToken);
    if (!userResponse.ok) {
      return null;
    }
    const user: UserDTO = await userResponse.json();

    const authUser: AuthUser = {
      accessToken: authData.accessToken,
      accessTokenExpiresAt: authData.accessTokenExpiresAt,
      refreshToken: authData.refreshToken,
      refreshTokenExpiresAt: authData.refreshTokenExpiresAt,
      id: user.id,
      userName: user.userName,
      displayName: user.displayName,
      role: user.role,
    };
    return authUser;
  }

  async refresh(refreshToken: string): Promise<AuthUser | null> {
    const refreshResponse = await Request.post("/users/session/refresh", null, {
      refreshToken: refreshToken,
    });
    if (!refreshResponse.ok) {
      LocalStorage.deleteRefreshToken();
      return null;
    }
    const authData: AuthDataDTO = await refreshResponse.json();

    const userResponse = await Request.get("/users/self", authData.accessToken);
    if (!userResponse.ok) {
      return null;
    }
    const user: UserDTO = await userResponse.json();

    const authUser: AuthUser = {
      accessToken: authData.accessToken,
      accessTokenExpiresAt: authData.accessTokenExpiresAt,
      refreshToken: authData.refreshToken,
      refreshTokenExpiresAt: authData.refreshTokenExpiresAt,
      id: user.id,
      userName: user.userName,
      displayName: user.displayName,
      role: user.role,
    };
    return authUser;
  }

  async logout(accessToken: string): Promise<boolean> {
    const response = await Request.post("/users/logout", accessToken, {
      deviceId: LocalStorage.getDeviceId(),
    });

    if (
      response.status === 204 ||
      response.status === 401 ||
      response.status === 403
    ) {
      LocalStorage.deleteRefreshToken();
      return true;
    }
    return false;
  }
}

export default new AuthenticationService();
