import type { AuthUser } from "../model/AuthUser";
import type { RefreshTokenData } from "../model/RefreshTokenData";

class LocalStorageService {
  getRefreshToken(): string | null {
    const storedRefreshTokenData = localStorage.getItem("refreshTokenData");
    if (storedRefreshTokenData) {
      try {
        const parsedData: RefreshTokenData = JSON.parse(storedRefreshTokenData);

        const now = new Date();
        const refreshTokenExpiry = new Date(parsedData.refreshTokenExpiresAt);

        if (now.getTime() > refreshTokenExpiry.getTime()) {
          return null;
        }

        return parsedData.refreshToken;
      } catch (error) {
        return null;
      }
    } else {
      return null;
    }
  }

  persistRefreshToken(authUser: AuthUser) {
    const refreshTokenData: RefreshTokenData = {
      refreshToken: authUser.refreshToken,
      refreshTokenExpiresAt: authUser.refreshTokenExpiresAt,
    };
    localStorage.setItem("refreshTokenData", JSON.stringify(refreshTokenData));
  }

  deleteRefreshToken() {
    localStorage.removeItem("refreshTokenData");
  }

  getDeviceId(): string {
    const storedDeviceId = localStorage.getItem("deviceId");
    if (storedDeviceId) {
      return storedDeviceId;
    } else {
      const newDeviceId = crypto.randomUUID();
      localStorage.setItem("deviceId", newDeviceId);
      return newDeviceId;
    }
  }
}

export default new LocalStorageService();
