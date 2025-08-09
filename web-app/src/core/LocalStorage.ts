import type { AuthUser } from "../models/AuthUser";

class LocalStorage {
  persistAuthUser(authUser: AuthUser | null) {
    if (!authUser) {
      localStorage.removeItem("authUser");
    } else {
      localStorage.setItem("authUser", JSON.stringify(authUser));
    }
  }

  getInitialAuthUser(): AuthUser | null {
    const storedUser = localStorage.getItem("authUser");
    if (storedUser) {
      try {
        const parsedUser: AuthUser = JSON.parse(storedUser);
        return parsedUser;
      } catch (error) {
        return null;
      }
    } else {
      return null;
    }
  }
}

export default new LocalStorage();
