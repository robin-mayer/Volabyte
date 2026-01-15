import { createContext, useContext, useEffect, useState } from "react";
import type { AuthUser } from "../models/AuthUser";
import LocalStorageService from "../service/LocalStorageService";
import RequestService from "../service/RequestService";
import type { AuthDataDTO } from "../models/AuthDataDTO";
import type { UserDTO } from "../models/UserDTO";

type AuthUserApi = {
  getAuthenticatedUser: () => AuthUser | null;
  setAuthenticatedUser: (user: AuthUser) => void;
  removeAuthenticatedUser: () => void;
};

const AuthUserContext = createContext<AuthUserApi | null>(null);

export const useAuthenticatedUser = () => {
  const context = useContext(AuthUserContext);
  if (!context) {
    throw new Error(
      "useAuthenticatedUser must be used within an AuthUserProvider"
    );
  }
  return context;
};

async function initialize(): Promise<AuthUser | null> {
  const refreshToken = LocalStorageService.getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  const refreshResponse = await RequestService.post(
    "/users/session/refresh",
    null,
    {
      refreshToken: refreshToken,
    }
  );
  if (!refreshResponse.ok) {
    LocalStorageService.deleteRefreshToken();
    return null;
  }
  const authData: AuthDataDTO = await refreshResponse.json();

  const userResponse = await RequestService.get(
    "/users/self",
    authData.accessToken
  );
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

async function refresh(refreshToken: string): Promise<AuthUser | null> {
  const refreshResponse = await RequestService.post(
    "/users/session/refresh",
    null,
    {
      refreshToken: refreshToken,
    }
  );
  if (!refreshResponse.ok) {
    LocalStorageService.deleteRefreshToken();
    return null;
  }
  const authData: AuthDataDTO = await refreshResponse.json();

  const userResponse = await RequestService.get(
    "/users/self",
    authData.accessToken
  );
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

async function logout(accessToken: string): Promise<boolean> {
  const response = await RequestService.post("/users/logout", accessToken, {
    deviceId: LocalStorageService.getDeviceId(),
  });

  if (
    response.status === 204 ||
    response.status === 401 ||
    response.status === 403
  ) {
    LocalStorageService.deleteRefreshToken();
    return true;
  }
  return false;
}

export const AuthenticatedUserProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    initialize().then((result) => {
      if (result) {
        setAuthUser(result);
      }
    });
  }, []);

  useEffect(() => {
    if (authUser) {
      LocalStorageService.persistRefreshToken(authUser);

      const timeUntilExpiry =
        new Date(authUser.accessTokenExpiresAt).getTime() -
        new Date().getTime();
      setTimeout(() => {
        if (authUser.refreshToken) {
          refresh(authUser.refreshToken).then((refreshedAuthUser) => {
            setAuthUser(refreshedAuthUser);
          });
        }
      }, timeUntilExpiry - 60000);
    }
  }, [authUser]);

  const api: AuthUserApi = {
    getAuthenticatedUser: () => authUser,
    setAuthenticatedUser: (user: AuthUser) => setAuthUser(user),
    removeAuthenticatedUser: () => {
      if (authUser?.accessToken) {
        logout(authUser.accessToken).then(() => {
          setAuthUser(null);
        });
      } else {
        setAuthUser(null);
      }
    },
  };

  return (
    <AuthUserContext.Provider value={api}>{children}</AuthUserContext.Provider>
  );
};
