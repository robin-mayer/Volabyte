import { createContext, useContext, useEffect, useState } from "react";
import type { AuthUser } from "../models/AuthUser";
import LocalStorageService from "../service/LocalStorageService";
import AuthenticationService from "../service/AuthenticationService";

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

export const AuthenticatedUserProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    AuthenticationService.initialize().then((result) => {
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
          AuthenticationService.refresh(authUser.refreshToken).then(
            (refreshedAuthUser) => {
              setAuthUser(refreshedAuthUser);
            }
          );
        }
      }, timeUntilExpiry - 60000);
    }
  }, [authUser]);

  const api: AuthUserApi = {
    getAuthenticatedUser: () => authUser,
    setAuthenticatedUser: (user: AuthUser) => setAuthUser(user),
    removeAuthenticatedUser: () => setAuthUser(null),
  };

  return (
    <AuthUserContext.Provider value={api}>{children}</AuthUserContext.Provider>
  );
};
