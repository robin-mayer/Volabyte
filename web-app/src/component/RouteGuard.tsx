import { Navigate, Outlet } from "react-router-dom";
import { useAuthenticatedUser } from "../provider/AuthenticatedUser";

export const RouteGuard = () => {
  const authenticatedUser = useAuthenticatedUser();
  if (!authenticatedUser.getAuthenticatedUser()) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};
